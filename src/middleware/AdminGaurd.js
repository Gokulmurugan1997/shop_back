import auth from "../utils/auth.js";

const Adminguard = async (req,res,next)=>{
    try {
        const token = await req?.headers?.authorization?.split(" ")[1]
        if (token) {
            const payload = await auth.decodeToken(token)
            if(payload.role==="seller")
            {
                next()
            }
            else{
                res.status(402).send({
                    message:"Access denied, Please Login as seller to continue"
                })
            }
        } else {
            res.status(402).send({
                message:"Please login as seller"
            })
        }
    } catch (error) {
        res.status(500).send({
            message:error.message||"internal error"
        })
    }
}

export default Adminguard

