import * as express from "express";
import { body } from "express-validator";
import verifyIdToken from "./verifyIdToken";
import { createUser, deleteUser } from "./users";

const router = express.Router();

router.post(
  "/create-user",
  verifyIdToken,
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  createUser
);

router.delete(
  "/delete-user",
  verifyIdToken,
  body("uid").isString(),
  deleteUser
);

export default router;
