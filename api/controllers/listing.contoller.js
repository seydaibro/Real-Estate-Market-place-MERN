
import {Listing} from '../modle/listing.model.js'



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
