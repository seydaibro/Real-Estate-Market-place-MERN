import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listRouter from './routes/listing.route.js'
import cors from 'cors'
import  cookieParser from 'cookie-parser'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

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
app.use("/api/listing",listRouter )



app.use((err, req, res , next)=>{
const statusCode = err.statusCode || 500
const message = err.message || "internal server err"
return res.status(statusCode).json({
  success: false,
  statusCode,
  message,

})
})

