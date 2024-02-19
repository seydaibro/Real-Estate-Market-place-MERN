import express from 'express'
import { createListing,deleteListing,editListing,getListing, getListings } from '../controllers/listing.contoller.js'
import { verifyToken } from '../utils/verifyUser.js'
const router = express.Router()

router.post('/create', createListing)
router.delete('/delete/:id',  deleteListing)
router.post('/edit/:id',  editListing)
router.get('/get/:id', getListing)
router.get('/get', getListings)


export default router