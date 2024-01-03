import { errHandler } from "../utils/err.js"
import bcryptjs from 'bcryptjs'
import User from '../modle/user.model.js'


export const updateUserInfo = async (req, res, next)=>{
   if(req.user.id !== req.params.id ) return next(errHandler(401, 'You can only uppdate your account'))

   try{
    if(req.body.password){
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }
const updateUser = await User.findByIdAndUpdate(req.params.id,{
    $set: {
       username: req.body.username,
       email: req.body.email,
       password: req.body.password,
       avatar: req.body.avatar
    }
},{new: true})
 const {password,...rest} = updateUser._doc
 res.status(200).json(rest)

   }catch(err){
    next(err)
   }

}