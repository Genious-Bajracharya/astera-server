import { Router } from "express";
import { 
  getTeam, 
  getTeamMember, 
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember 
} from "../controllers/team.controller";

const router = Router();

router.get("/", getTeam);
router.get("/:id", getTeamMember);        
router.post("/", createTeamMember);
router.put("/:id", updateTeamMember);     
router.delete("/:id", deleteTeamMember);  

export default router;
