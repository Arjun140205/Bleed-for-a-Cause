import { Router } from "express";
import { calculateThalassemiaRisk } from "../controllers/thalassemiaController.js";

const thalassemiaRouter = Router();

/**
 * @route   POST /api/thalassemia/risk
 * @desc    Calculate risk of thalassemia in offspring based on parents' status
 * @access  Public
 */
thalassemiaRouter.post("/api/thalassemia/risk", calculateThalassemiaRisk);

export default thalassemiaRouter;
