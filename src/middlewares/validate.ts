import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"

export const validate = async (req:Request,res:Response,next:NextFunction) =>{
    const auth =req.headers.authorization
    
    const token = auth?.split(' ')[1] as string

    if(!token){
        return res.status(401).json({message:"No Access"})
    }
   

    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET!)
        //@ts-expect-error //ignore 
        req.user= decode
        next()
    }catch(error){
        res.status(403).json({message:"error: " ,error})
    }
}