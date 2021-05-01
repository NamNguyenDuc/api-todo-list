import express from "express";
const router = express.Router();
import { signup, signin, signout, checkLogin } from "../controllers/auth";

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/check", checkLogin);
router.get('/signout', signout);
module.exports = router;