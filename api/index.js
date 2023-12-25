import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'

dotenv.config()
const app = express()
app.use(express.json())


mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log("connection sucesseds")
  
  app.listen(3000, (req, res)=>{
    console.log("listening")
  })

})
.catch(err => {
 console.error("Connection error:", err)
 
})

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)