import { Request,Response } from "express";
import Career from "../models/career";

// Create Career 
export const createCareer = async (req:Request,res:Response) => {
    try{
        // const user=(req as any).user;
        // console.log(user)
        const career = await Career.create(req.body)
        res.status(201).json(career)
    }catch(error){
        res.status(501).json({error})
    }
}

// Get All Careers
export const getCareers = async (_: Request, res: Response) => {
  try {
    const careers = await Career.find();
    res.json(careers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch careers" });
  }
};

// get career by id 
export const getCareer = async (req:Request,res:Response) =>{
    try{
        const career = await Career.findById(req.params.id);
        if (!career) return res.status(404).json({ error: "Career not found" });
        res.json(career);
    }
    catch(error){
        res.status(500).json({error})
    }
}

//updaet a career
export const updateCareer = async (req: Request, res: Response) => {
  try {
    const updated = await Career.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ error: "Career not found" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update career" });
  }
};


//delete a carreer
export const deleteCareer = async (req: Request, res: Response) => {
  try {
    const deleted = await Career.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ error: "Career not found" });

    res.json({ message: "Career deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete career" });
  }
};
