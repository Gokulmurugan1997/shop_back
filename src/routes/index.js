import express from "express"
import userRoutes from "./user.js"
import sellerRoutes from "./seller.js"
let router = express.Router()

router.use("/shop", userRoutes)
router.use("/seller", sellerRoutes)

export default router