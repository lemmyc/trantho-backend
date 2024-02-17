import { Router } from "express";
import { signUpStaff, getStaffById, getAllStaffs, updateStaff} from "../controllers/staff-controllers.js";

const staffRoutes = Router();

staffRoutes.post("/signup", signUpStaff);

staffRoutes.route("/")
    .get(getAllStaffs);

staffRoutes.route("/:id")
    .put(updateStaff)
    .get(getStaffById);

export default staffRoutes;