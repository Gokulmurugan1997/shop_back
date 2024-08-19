import mongoose from "./index.js"

const validateEmail = (email)=>{
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
}

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "name is required"]
    },
    email:{
        type:String,
        required:[true, "email is required"],
        validate:{
            validator:(value)=>validateEmail(value)
        }
    },
    password:{
        type:String,
        required:[true, "password is required"]
    },
    role:{
        type:String,
        default:"seller"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetToken:{
        type:String,
        default:null
    },
    resetTokenExpriration:{
        type:String,
        default:null
    }
},
{
    collections:"Shop_Seller",
    versionKey:false
})


var sellerModel = mongoose.model("sellers", userSchema)

export default sellerModel





