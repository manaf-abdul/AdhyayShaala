import User from '../models/user'
import { comparePassword, hashPassword } from '../utils/auth'
import jwt from 'jsonwebtoken'
import user from '../models/user'

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        let userExist = await User.findOne({ email }).exec()
        if (userExist) return res.status(400).send("Email is taken")
        const hashedpassword = await hashPassword(password)

        const user = await new User({
            name, email, password: hashedpassword
        }).save()
        console.log(user);
        return res.status(200).json({ Success: "true" })
    } catch (error) {
        console.log(error);
        return res.status(400).send("Error,register ")
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email }).exec()
        if (!user) return res.status(400).send("No User Found")
        //check password
        const match = await comparePassword(password, user.password)
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
        user.password = undefined;
        res.cookie('token', token, {
            httpOnly: true,
            // secure:true
        })
        res.json(user)
    } catch (error) {
        console.log(error);
        return res.status(400).send("Error,login")
    }
}

export const logout = async (req, res) => {
    try {
       res.clearCookie("token")
       return res.json({message:"SignOut Success"})
    } catch (error) {
        console.log(error);
        return res.status(400).send("Error,logout")
    }
}

export const currentUser=async(req,res)=>{
    console.log(req.user)
    try {
        const user=await User.findById(req.user).select('-password').exec()
        return res.json({ok:true})
    } catch (error) {
        console.log(error);
        return res.status(400).send("Error,currentUser")
    }
}