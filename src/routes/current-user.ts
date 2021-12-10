import express, { Request, Response, } from "express";
import { currentUser } from "@ticketshub/commun";//me permite conocer el usuario actual

const router = express.Router();

router.get("/api/users/current-user", currentUser, (req: Request, res: Response) => {
    res.send({ CurrentUser: req.currentUser || null });
});

export { router as currentUserRouter };

