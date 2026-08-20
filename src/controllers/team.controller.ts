import { Request, Response } from "express";
import Team from "../models/team";

// Get all team members
export const getTeam = async (req: Request, res: Response) => {
  try {
    const members = await Team.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch team members", error });
  }
};

// Create a new team member
export const createTeamMember = async (req: Request, res: Response) => {
  try {
    const newMember = new Team(req.body);
    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ message: "Failed to create team member", error });
  }
};

// Get single team member by ID
export const getTeamMember = async (req: Request, res: Response) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch team member", error });
  }
};

// Update team member
export const updateTeamMember = async (req: Request, res: Response) => {
  try {
    const updated = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Team member not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update team member", error });
  }
};

// Delete team member
export const deleteTeamMember = async (req: Request, res: Response) => {
  try {
    const deleted = await Team.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Team member not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete team member", error });
  }
};
