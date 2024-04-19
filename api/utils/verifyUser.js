import jwt from 'jsonwebtoken';
import User from '../modle/user.model.js' // Replace with the appropriate User model import

export const verifyToken = async (req, res, next) => {
  // console.log("header", req.headers)
  const token = req.headers.authorization;
//   console.log("token",token)
// console.log("veryfiytokencalled")
  
  if (!token) {
    console.log("nottoken")
    return res.status(401).json({ message: 'Token not provided' });
    
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};