import { Router } from "express";
import userRouter from "./users.js";
import postRouter from "./post.js";

const router = Router();

router.use('/users', userRouter)
router.use('/post', postRouter)
export default router;