import { Router } from "express";
import { addInwardNote, editInwardNote, getInwardNoteById, getAllInwardNotes } from "../controllers/inward-note-controllers.js";

const inwardNoteRoutes = Router();

inwardNoteRoutes.route("/")
    .get(getAllInwardNotes);
inwardNoteRoutes.route("/:id")
    .get(getInwardNoteById);
inwardNoteRoutes.route("/add")
    .post(addInwardNote);
inwardNoteRoutes.route("/edit/:id")
    .put(editInwardNote);

export default inwardNoteRoutes;