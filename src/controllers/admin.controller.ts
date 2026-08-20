import Admin from "../models/admin";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const Register = async (req:Request,res:Response) =>{
    try{

            const {username,password} =req.body
        
            const exsisting =await  Admin.findOne({username})
            if(exsisting){
                res.json({message:"Username already exsists"})
            }
            const code=9
            const hashed=await bcrypt.hash(password,code)
        
            const newAdmin = new Admin({
                username,password:hashed
            })
        
            await newAdmin.save()
    }catch(error){
        res.status(501).json({message:"error:",error})
    }
}
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRETKEY!);
    const admin = await Admin.findById(decoded.userId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Current password incorrect" });

    const hashed = await bcrypt.hash(newPassword, 9);
    admin.password = hashed;
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Error updating password", error: err.message });
  }
};


export const login = async (req:Request,res:Response) =>{
    try{

        const {username,password} =req.body
    
        const admin = await Admin.findOne({username})
        if(!admin){
            return res.status(401).json({message:"Invalid username"})
        }
    
        const isMatch =await bcrypt.compare(password,admin.password)
        if(!isMatch){
            return res.status(401).json({message:"Invalid password"})
        }
    
        const token= jwt.sign({userId:admin?._id},process.env.JWT_SECRETKEY!,{expiresIn: "7d"})
    
        res.status(201).json({message:"successful",token})
    }catch(error:any){
        res.status(401).json({error:error?.message})
    }

}