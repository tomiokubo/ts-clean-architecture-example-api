import { Express, Router } from "express";
import login from "../routes/login-routes";
import signup from "../routes/sign-up-routes";

export default (app: Express): void => {
  app.use("/login/", login);
  app.use("/signup/", signup);
};
