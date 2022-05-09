import { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const verifyIdToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const { uid } = decodedToken;

    console.log(uid);

    const db = getFirestore();
    const users = await db.collection("users").where("uid", "==", uid).get();

    if (users.empty) {
      return res.status(401).json({ error: "User not found" });
    }

    const userData = users.docs[0].data();

    if (userData.role !== "manager") {
      return res.status(401).json({ error: "User not authorized" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalid" });
  }
};

export default verifyIdToken;
