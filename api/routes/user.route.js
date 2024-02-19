import express from 'express'
import {  updateUserInfo , deleteUser, getUserListing, getUser} from '../controllers/user.controller.js'
import {verifyToken} from '../utils/verifyUser.js'

const router = express.Router()


router.post('/update/:id', updateUserInfo)
router.delete('/delete/:id', deleteUser)
router.get('/listings/:id',  getUserListing)
router.get('/:id', getUser)

export default router