
import {Listing} from '../modle/listing.model.js'
import { errHandler } from '../utils/err.js';



export const createListing = async (req, res, next) => {
  
    try {
        const newListing = await Listing.create(req.body);
        return res.status(200).json(newListing);
        
      } catch (err) {
        if (err.name === 'ValidationError') {
          // Handle validation errors
          return res.status(400).json({ success: false, error: err.message });
        }
        console.error("Error creating listing:", err);
        next(err);
      }
      
   
};

export const deleteListing = async (req, res, next)=>{

  const listing = await Listing.findById(req.params.id)

  if(!listing){
  return next(errHandler(404, 'Listing not found!'))
  }
  if(req.user.id !== listing.useerRef){
    return next(errHandler(401, 'You can only delete your own listings!'))

  }

  try{
  await Listing.findByIdAndDelete(req.params.id)
  res.status(200).json('Listing has been deleted')
  }catch(err){
    next(err)
  }
}
export const editListing = async(req, res, next)=>{
  const listing = await Listing.findById(req.params.id)

  if(!listing){
  return next(errHandler(404, 'Listing not found!'))
  }
  if(req.user.id !== listing.useerRef){
    return next(errHandler(401, 'You can only delete your own listings!'))

  }
  try{
  const updatedListing = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true}
  )
  res.status(200).json(updatedListing)
  }catch(err){
    next(err)
  }
}
export const getListing = async(req, res, next)=>{
  try{
    const listing = await Listing.findById(req.params.id)
    if(!listing){
      return next(errHandler(404,'Listing not foound'))
    }
    res.status(200).json(listing)
  }catch(err){
    next(err)
  }
}