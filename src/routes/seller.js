import express from "express";
import sellerController from "../controller/seller.js"
import Adminguard from "../middleware/AdminGaurd.js";
import validate from "../middleware/Validate.js";

let router = express.Router()

router.post('/signup', sellerController.signup)
router.post('/login',sellerController.login)
router.post('/forgetpassword', sellerController.forgetPassword)
router.post('/resetpass', sellerController.resetPassword)
router.post('/addcart', sellerController.addCart)
router.get('/getcart', sellerController.getCart)

export default router