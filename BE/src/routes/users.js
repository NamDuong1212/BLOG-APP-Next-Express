import UserCTL from "../controllers/users.js";
import { Router } from "express";
import UserMDW from "../middlewares/users.js";
const userRouter = Router();

userRouter.post('/signup', UserMDW.checkSignup, UserCTL.signup)
userRouter.post('/login', UserMDW.checkLogin, UserCTL.login)
userRouter.put('/updateUser/:userID', UserMDW.validateToken,UserCTL.updateUser)
export default userRouter;
