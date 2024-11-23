import auth from "../utils/auth.js";
import sellerModel from "../model/seller.js";
import crypto from 'crypto'
import nodemailer from "nodemailer"
import productModel from "../model/product.js"
import cartModel from "../model/cart.js";

const signup = async(req,res)=>{
    try {
        let user = await sellerModel.findOne({email:req.body.email})

        if(!user){
            req.body.password = await auth.hashPassword(req.body.password)

            await sellerModel.create(req.body)

            res.status(200).send({
                message:"user created successfully"
            })
        }else{
            res.status(400).send({
            message:"user already exist"
            })
        }
    } catch (error) {
        res.status(500).send({
            message:error.message|| "internal server error"
        })
    }
}

const login = async(req, res)=>{
    try {
        let user = await sellerModel.findOne({email:req.body.email})

        if(user){
            if(await auth.hashCompare(req.body.password, user.password)){
                let token = await auth.createToken({
                    name:user.name,
                    email:user.email,
                    id:user._id,
                    role:user.role
                })
                console.log(token)
                res.status(200).send({
                    message:"login successful",
                    name:user.name,
                    email:user.email,
                    id:user._id,
                    token
                })
            }else{
                res.status(400).send({
                    message:"password wrong"
                })
            }
        }else{
            res.status(401).send({
                message:"user not exist"
            })
        }
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal error"
        })
    }
}

const forgetPassword = async (req,res) =>{
    try {
        const user = await sellerModel.findOne({email:req.body.email})

        if (!user) {
            res.status(402).send({
                message:"user not found, please enter valid email"
            })
        }
        const resetToken = crypto.randomBytes(15).toString('hex')
        user.resetToken = resetToken
        user.resetTokenExpriration = Date.now()+3600000
        await user.save()

        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
            user: "gokulmuruganp@gmail.com",
            pass: "peup grbt juyr fxkj"
            }
        })

        const mailOption = {
            from: "gokulmuruganp@gmail.com",
            to: user.email,
            subject: 'Password Reset',
            text:`http://localhost:5173/seller/resetPassword/${resetToken}`
        }
            transporter.sendMail(mailOption,(error, info)=>{
                if(error){
                    console.log(error)
                    res.status(500).json({error:"Error sending email"})
                }else{
                    console.log("Email sent: " + info.response);
                    res.json({
                        message:"reset link sent to your email"
                    })
                }
            })
        
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal server error"
        })
    }
}

const resetPassword = async (req,res)=>{
    try {
        let token = req.body.token
        console.log(token)
        if(token){
            let user = await sellerModel.findOne({
                resetToken:req.body.token
            })
            if (user) {
                user.password = await auth.hashPassword(req.body.password)
                await user.save()
                res.status(200).send({ 
                    message:"user password reset successfully"
                })
            } else {
                res.status(400).send({
                    message:"user not found"
                })
            }
        }
        else{
            res.status(400).send({
                message:"token not found"
            })
        }
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal server error"
        })
    }
}

const addCart = async (req, res)=>{
    try {
            await productModel.create(req.body)
            res.status(200).send({
                message:"product details updated successfully"
        })
    
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal error"
        })
    }
}

const getCart = async(req,res)=>{
    try {
        let product = await productModel.find({})
        res.status(201).send(product)
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal error"
        })
    }
}
const getProductById = async (req, res) => {
    try {
        
        let product = await productModel.findOne({_id:req.params.id});

        if (!product) {
            return res.status(404).send({
                message: "Product not found"
            });
        }
        await cartModel.create({
            email:product.email,
            product:product.product,
            cost:product.cost,
            image:product.image
        })
        res.status(200).send({
            message: "Product added to cart successfully",
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        });
    }
};

const getMyCart = async (req, res) => {
    try {
        let product = await cartModel.find({})
        res.status(201).send(product)
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal error"
        })
    }
}
const deleteById = async (req,res) =>{

    try {
        let del = await cartModel.deleteOne({_id:req.params.id})
        res.status(200).send({
            message: "Product deleted from cart successfully",
        });
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal error"
        })
    }
}

const totalCost = async (req, res) => {
    try {
       
        const result = await cartModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$cost" }, 
                    totalCount: { $sum: 1 } 
                }
            }
        ]);

        if (result.length === 0) {
            return res.status(404).send({
                message: "No products found to calculate total cost."
            });
        }

        res.status(200).send({
            message: "Total cost calculated successfully",
            totalAmount: result[0].totalAmount,
            totalCount: result[0].totalCount 
        });

    } catch (error) {
        res.status(500).send({
            message: error.message || "Internal error"
        });
    }
}


  

export default{
    signup,
    login,
    forgetPassword,
    resetPassword,
    addCart,
    getCart,
    getProductById,
    getMyCart,
    deleteById,
    totalCost
}