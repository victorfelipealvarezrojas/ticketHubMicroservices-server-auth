import express from "express";

const router = express.Router();

router.post("/api/users/sign-out", (req, res) => {
  //cada vez que el usuario realice una solicitud de seguimiento, no se incluirá ningún token dentro de esa cookie
  req.session = null;

  res.send({});

});


export { router as signOutRouter };