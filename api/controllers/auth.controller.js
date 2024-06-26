import User from '../modle/user.model.js';
import bcrypt from 'bcryptjs';
import {errHandler} from '../utils/err.js'
import  jwt from 'jsonwebtoken' 


export const register = async (req, res, next) => {


  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    
    res.status(200).json('User created successfully');
  } catch (error) {
    next(error)
  }
};

export const signin = async (req, res ) => {
  const { email, password } = req.body;
  console.log("signin", req.body);

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errHandler(404, "User not found"));
    }
    const validPassword = bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(errHandler(401, "Wrong credential!"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res.status(200).json({token, user: rest})
   
  } catch (err) {
    next(err);
  }
};



export const google = async(req, res, next)=>{
  try{
   const user = await User.findOne({email: req.body.email})
   if(user){
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
    const {password: pass, ...rest} = user._doc
    res.status(200).json({token, user: rest})
   }else{
    const generatePassword = Math.random().toString(36).slice(-8) +  Math.random().toString(36).slice(-8)
    const hashedPassword = bcrypt.hashSync(generatePassword, 10)
    const newUser = new User({
      username:req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
      email:req.body.email, 
      password:hashedPassword,
      avatar: req.body.photo
      })

    await newUser.save()
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
    const {password: pass, ...rest} = user._doc
    res.status(200).json({token, user: rest})
    

   }
  }catch(err){
    next(err)
  }
}


export const signout = (req, res, next)=>{
 try{
  res.clearCookie('token')
   res.status(200).json("user has been logged out")
 }catch(err){
  next(err)
 }
}