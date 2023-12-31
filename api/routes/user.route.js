import express from 'express'
import {  updateUserInfo , deleteUser, getUserListing} from '../controllers/user.controller.js'
import {verifyToken} from '../utils/verifyUser.js'

const router = express.Router()


router.post('/update/:id',verifyToken, updateUserInfo)
router.delete('/delete/:id',verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListing)

export default router