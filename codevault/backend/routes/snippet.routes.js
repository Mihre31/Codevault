import express from "express";
import {
  createSnippet,
  deleteSnippet,
  getSnippet,
  getSnippets,
  toggleFavorite,
  updateSnippet,
} from "../controllers/snippet.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getSnippets).post(createSnippet);
router
  .route("/:id")
  .get(getSnippet)
  .put(updateSnippet)
  .delete(deleteSnippet);
router.patch("/:id/favorite", toggleFavorite);

export default router;
