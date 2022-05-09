import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { validationResult } from "express-validator";

export const createUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await getAuth().createUser({
      email,
      password,
    });

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error: any) {
    console.log(error, error?.errorInfo);

    if (error.errorInfo?.code === "auth/email-already-exists") {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    res.status(500).json({
      message: "Some errors occured",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { uid } = req.body;

  try {
    await getAuth().deleteUser(uid);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Some errors occured",
    });
  }
};
