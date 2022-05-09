import * as express from "express";
import * as admin from "firebase-admin";
import * as cors from "cors";
import router from "./routes";

const serviceAccount = require("../serviceAccountKey.json");

const app: express.Application = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use("/api", router);

app.listen(3001, () => {
  console.log("Server started on port 5000");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bike-rentals-vip.firebaseio.com",
  });
});
