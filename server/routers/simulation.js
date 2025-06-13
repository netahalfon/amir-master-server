/* routers/simulationRouter.js */
const express = require("express");
const simulationRouter = express.Router();
const {
  authonticateToken,
  adminAccess,
} = require("../middlewares/authonticateToken");
const simulationController = require("../controllers/simulationController");

simulationRouter.get(
  "/:id",
  authonticateToken,
  simulationController.getSimulation
);

simulationRouter.get(
  "/",
  authonticateToken,
  simulationController.getAllSimulationsOptions
);

simulationRouter.post(
  "/import",
   //authonticateToken,
   //adminAccess,
  simulationController.importSimulations    
);

simulationRouter.delete(
  "/delete/:id",
  authonticateToken,
  adminAccess,
  simulationController.deleteSimulation
);

module.exports = { simulationRouter };
