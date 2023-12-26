import User from '../modle/user.model.js';
import bcrypt from 'bcryptjs';
import {errHandler} from '../utils/err.js'
import  jwt from 'jsonwebtoken' 

export const register = async (req, res, next) => {
  console.log(req.body);

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

export const signin = async(req, res, next)=>{
  const {email, password } = req.body
  console.log(req.body)

  try{
  const validUser = await User.findOne({email})
  if(!validUser) return next(errHandler(404, 'User not found'))
  const validPassword = bcrypt.compareSync(password, validUser.password)
  if(!validPassword) return next(errHandler(401, 'Wrong credential!'))
 const token = jwt.sign({id:validUser._id}, process.env.JWT_SECRET)
 const { password: pass, ...rest} = validUser._doc
res.cookie('acess_token', token, {httpOnly: true})
.status(200).json(rest)

  }catch(err){
    next(err)
  }
}
