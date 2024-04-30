import { errHandler } from "../utils/err.js"
import bcryptjs from 'bcryptjs'
import User from '../modle/user.model.js'
import {Listing} from '../modle/listing.model.js'


export const updateUserInfo = async (req, res, next)=>{
   

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


export const deleteUser = async(req, res, next)=>{
   
    try{
await User.findByIdAndDelete(req.params.id)
res.status(200).json('user has been deleeted!').clearCookie()
}catch(err){
    next(err)
}

}

export const getUserListing = async(req, res, next)=>{
  
        try{
           const listings = await Listing.find({useerRef: req.params.id})
           res.status(200).json(listings)
        }catch(err){
            next(err)
        }
    
} 

export const  getUser = async (req, res, next)=>{
try{
    const user = await User.findById(req.params.id)
    console.log(req.params.id)

    if(!user) return next(errHandler(404, 'user not found'))
    const {password: pass, ...rest} = user._doc
  res.status(200).json(rest)
}catch(err){
    next(err)
}
    
  
}