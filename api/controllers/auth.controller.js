import User from '../modle/user.model.js';
import bcrypt from 'bcryptjs';

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
