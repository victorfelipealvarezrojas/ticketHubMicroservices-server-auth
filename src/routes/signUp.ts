import express, { Request, Response } from "express";
import { body } from "express-validator";
import Jwt from "jsonwebtoken";
import { User as userModel } from '../models/user';
import { BadRequestError,ValidateRequest } from "@ticketshub/commun";

//import { RequestValidationError } from "../errors/request-validation-errors";\

const router = express.Router();

router.post("/api/users/sign-up",
  [
    body("email")
      .isEmail()
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must to between 4 and 20 characters"),
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {
    //los manejo de sde el middleware
    //const errors = validationResult(req);
    //if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

    const { email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) throw new BadRequestError('Email in use');

    const user = userModel.buildUser({
      email,
      password
    });

    await user.save();

    //creo un token asociado a esta peticion
    const userJwt = Jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!);

    //store in session object, queda almacenado en las cookies de express y sera enviado en cada peticion
    req.session = {
      jwt: userJwt
    };

    res.status(201).send(user);

  }
);

export { router as signUpRouter };
