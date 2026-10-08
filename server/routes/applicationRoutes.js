import express from "express";
import {
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  updateApplication
} from "../controllers/applicationController.js";

const router = express.Router();

router.route("/").get(getApplications).post(createApplication);
router
  .route("/:id")
  .get(getApplicationById)
  .patch(updateApplication)
  .delete(deleteApplication);

export default router;
