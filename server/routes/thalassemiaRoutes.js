import { Router } from "express";
import { calculateThalassemiaRisk } from "../controllers/thalassemiaController.js";

const thalassemiaRouter = Router();

/**
 * @route   POST /thalassemia/risk
 * @desc    Calculate risk of thalassemia in offspring based on parents' status
 * @access  Private
 */
thalassemiaRouter.post("/risk", calculateThalassemiaRisk);

export default thalassemiaRouter;
