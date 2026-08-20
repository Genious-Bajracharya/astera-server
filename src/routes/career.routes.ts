import { Router } from "express";
import { createCareer,getCareers,getCareer,updateCareer,deleteCareer } from "../controllers/career.controller";
import { validate } from "../middlewares/validate";


const router =Router()

router.get('/',getCareers)

router.post('/',createCareer)

router.get('/:id',getCareer)

router.put('/:id',updateCareer)

router.delete('/:id',deleteCareer)

export default router