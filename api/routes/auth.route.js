import express from 'express'
import { register , signin, google} from '../controllers/auth.controller.js' 

const router = express.Router()

router.post("/register", register)
router.post('/signin', signin)
router.post('/google', google)

export default router