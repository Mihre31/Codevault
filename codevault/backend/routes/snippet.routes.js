import express from "express";
import {
  createSnippet,
  deleteSnippet,
  getSnippet,
  getSnippets,
  getTrashSnippets,
  permanentlyDeleteSnippet,
  restoreSnippet,
  toggleFavorite,
  updateSnippet,
} from "../controllers/snippet.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getSnippets).post(createSnippet);
router.get("/trash", getTrashSnippets);
router.patch("/:id/restore", restoreSnippet);
router.delete("/:id/permanent", permanentlyDeleteSnippet);
router
  .route("/:id")
  .get(getSnippet)
  .put(updateSnippet)
  .delete(deleteSnippet);
router.patch("/:id/favorite", toggleFavorite);

export default router;
