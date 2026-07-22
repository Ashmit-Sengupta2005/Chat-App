import express from "express";
import { LoginUser,LogoutUser,RegisterUser,checkAuth,UpdateProfilePic,updateUsername,updateEmail,updatePassword,deleteAccount} from "../Controllers/AuthControllers.js";
import { protectRoutes } from "../MiddleWare/ProtectRoutes.js";
const router=express.Router();
router.post("/register",RegisterUser);
router.post("/login",LoginUser);
router.post("/logout",protectRoutes,LogoutUser);
router.put("/updateProfilePicture",protectRoutes,UpdateProfilePic);
router.put("/updateUsername",protectRoutes,updateUsername);
router.put("/updateEmail",protectRoutes,updateEmail);
router.put("/updatePassword",protectRoutes,updatePassword)
router.get("/check",protectRoutes,checkAuth);
router.delete("/deleteAccount",protectRoutes,deleteAccount);
export default router;