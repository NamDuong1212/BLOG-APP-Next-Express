import UserModel from "../models/users.js";
import { comparePassword } from "../helpers/bcryptjs.js";
import jwt from "jsonwebtoken";

const UserMDW = {
        checkSignup: async (req, res, next) => {
            try {
            const { name, email, password, confirmPassword, phone } = req.body;
            const user = await UserModel.findOne({ email });
            const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            const isCheckEmail = reg.test(email);
            if (user) throw new Error("Email already exists!"); 
            if (!name || !email || !password || !confirmPassword || !phone)
                throw new Error("The input is required!");
            if (password !== confirmPassword) 
                throw new Error("The password is equal!");
            if (isCheckEmail === false)
                throw new Error("Email must be a true format!");
            next();
            } catch (e) {
            res.status(400).send({
                message: e.message,
                status: "Failed!",
            });
            }
        },
        checkLogin: async(req, res, next) => {
            try {
                const { email, password } = req.body;
                const user = await UserModel.findOne({ email });
                if (!user) {
                    throw new Error("Incorrect email or password");
                }
                const isPasswordValid = await comparePassword(password, user.password);
                if (!isPasswordValid) {
                    throw new Error("Incorrect email or password");
                }
                next();
            } catch (e) {
                return res.status(400).send({
                    message: e.message,
                    status: "Failed",
                });
            }
        },
        validateToken: async(req, res, next) => {
            const authHeader = req.headers['authorization'];
            if (authHeader) {
              const token = authHeader.split(' ')[1];
          
              jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => { 
                if (err) {
                  return res.status(401).json({ message: 'Access token is invalid' });
                } else {
                  req.user = decoded; 
                  next();
                }
              });
            } else {
              res.status(401).json({ message: 'Access token is missing' });
            }
        },
        isAdmin: async (req, res, next) => {
            try{
              const { userID } = req.params;
              const user = await UserModel.findById(userID);
              if(!user) throw new Error("User don't existed!")
              if(user.isAdmin === false) throw new Error("Unauthorize access!")
              next();
            }
            catch(e){
              res.status(401).send({
                message: e.message,
                status: false
              })
            }
          }
};
export default UserMDW;