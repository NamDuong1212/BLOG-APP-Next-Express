import { Router } from "express";
import postCTL from "../controllers/post.js";
import UserMDW from "../middlewares/users.js";
const postRouter = Router();

postRouter.post('/create/:userID', UserMDW.validateToken, UserMDW.isAdmin, postCTL.create)

postRouter.get('/getPost', postCTL.getPost)
postRouter.get('/getPostByID/:postID', postCTL.getPostById)

postRouter.put('/updatePost/:userID/:postID', UserMDW.validateToken, UserMDW.isAdmin, postCTL.update)
postRouter.delete('/deletePost/:userID/:postID', UserMDW.validateToken, UserMDW.isAdmin, postCTL.delete)
export default postRouter;
