
import User from '../modle/user.model.js'
import bcryptjs from 'bcryptjs'

export const register =  async (req, res)=>{

    try{
        const { username, email, password} = req.body
        const hashedPassword =bcryptjs.hashSync(password, 10)
    
        const newUser = new User ({username, email, hashedPassword})
        await newUser.save()
        res.status(200).json('user created successfully')
    }catch(err){
      res.status(500).json(err.message)
    }
   
}

// shubo 
