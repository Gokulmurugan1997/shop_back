import express from "express"
import userController from "../controller/user.js"
let router = express.Router()

router.post("/signup",userController.signup)
router.post("/login", userController.login)
router.post("/forgetPassword", userController.forgetPassword)
router.post("/resetPass", userController.resetPassword)

export default router