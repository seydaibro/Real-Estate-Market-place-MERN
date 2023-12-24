import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const app = express()




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
