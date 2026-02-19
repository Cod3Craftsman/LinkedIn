import express from "express"
import { logIn, logOut, signup } from "../controllers/auth.controllers.js"
let authRouter = express.Router()

authRouter.post("/signup",signup)
authRouter.post("/login",logIn)
authRouter.get("/logout",logOut)

export default authRouter