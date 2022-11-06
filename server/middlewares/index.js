import { expressjwt } from 'express-jwt'
import jwt from 'jsonwebtoken'

// export const requireSignIn=expressjwt({
//     getToken:(req,res)=>req.cookies.token,
//     secret:process.env.JWT_SECRET,
//     algorithms:["HS256"]
// })

export const requireSignIn = (req, res, next) => {
    let token = req.cookies.token
    if (token) {
        console.log("token", token);
        const decoded = jwt.decode(token, process.env.JWT_KEY);
        console.log("decoded", decoded);
        req.user = decoded._id;
        next();
    }else{
        res.send(401).json({message:"Access Denied"})
    }

}