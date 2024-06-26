
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
    console.log(req.params.id)
    if(!listing){
      return next(errHandler(404,'Listing not foound'))
    }
    res.status(200).json(listing)
  }catch(err){
    next(err)
  }
}


export const getListings = async(req, res, next)=>{
 
    try {
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;
      let offer = req.query.offer;
  
      if (offer === undefined || offer === 'false') {
        offer = { $in: [false, true] };
      }
  
      let furnished = req.query.furnished;
  
      if (furnished === undefined || furnished === 'false') {
        furnished = { $in: [false, true] };
      }
  
      let parking = req.query.parking;
  
      if (parking === undefined || parking === 'false') {
        parking = { $in: [false, true] };
      }
  
      let type = req.query.type;
  
      if (type === undefined || type === 'all') {
        type = { $in: ['sale', 'rent'] };
      }
  
      const searchTerm = req.query.searchTerm || '';
  
      const sort = req.query.sort || 'createdAt';
  
      const order = req.query.order || 'desc';
  
      const listings = await Listing.find({
        name: { $regex: searchTerm, $options: 'i' },
        offer,
        furnished,
        parking,
        type,
      })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
  
      return res.status(200).json(listings);


  }catch(error){
    next(error)
  }
}