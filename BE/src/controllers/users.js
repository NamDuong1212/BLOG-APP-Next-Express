import UserModel from "../models/users.js";
import { hashPassword } from "../helpers/bcryptjs.js";
import { comparePassword } from "../helpers/bcryptjs.js";
import jwt from "jsonwebtoken";

const UserCTL = { 
    signup: async(req, res)=>{
    try {
      const { name, email, password, confirmPassword, phone, role } = req.body
      const hash = await hashPassword(password);
      const user = await UserModel.create({ 
        name,
        email,
        password: hash,
        confirmPassword,
        phone,
        role,
      });
      res.status(201).send({ 
        message: "Register successfully!",
        data: user
      })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }},

    login: async(req, res) => {
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
            const payload = {
                id: user.id,
                email: user.email,
                password: user.password
            };
            const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1h' });
            res.status(200).send({
                message: "Login successful",
                access_token: token,
                data: payload
            });
        } catch (e) {
            return res.status(400).json({
                message: e.message,
                status: "Failed",
            });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { userID } = req.params;
            const { phone, birthday, bio } = req.body;
            
            const updatedUser = await UserModel.findByIdAndUpdate(userID, {
                phone,
                birthday,
                bio
            }, { new: true });
            
            if (!updatedUser) {
                return res.status(404).json({
                    message: 'User not found',
                    status: 'Failed',
                });
            }
            
            res.status(200).send({
                message: 'Update profile successfully',
                data: updatedUser
            });
        } catch (e) {
            return res.status(400).json({
                message: e.message,
                status: 'Failed',
            });
        }
    },
}
export default UserCTL;