
import {Listing} from '../modle/listing.model.js'



export const createListing = async( req, res, next)=>{

    try{
    const Listing = await Listing.create(req.body)
    return res.status(200).json(Listing)
    }catch(err){
        next(err)
    }
}