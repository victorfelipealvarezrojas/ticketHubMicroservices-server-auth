import express, { Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { body } from 'express-validator';
import { User as userModel } from '../models/user';
import { ValidateRequest,BadRequestError } from "@ticketshub/commun";
import { Password } from '../services/password';
//import { RequestValidationError } from "../errors/request-validation-errors";

const router = express.Router();

router.post("/api/users/sign-in",
  [
    body("email")
      .isEmail()
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("You must supply a password"),
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {
    //lo manejo desde ValidateRequest
    //const errors = validationResult(req);
    //if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

    const { email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (!existingUser) throw new BadRequestError('Invalid credentials');

    const passwordMatch = await Password.compare(existingUser.password, password);

    if (!passwordMatch) throw new BadRequestError('Invalid credentials');

    const userJwt = Jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!);

    //store in session object, queda almacenado en las cookies de express y sera enviado en las peticiones
    req.session = {
      jwt: userJwt
    };

    res.status(200).send(existingUser);
  });

export { router as signInRouter };
