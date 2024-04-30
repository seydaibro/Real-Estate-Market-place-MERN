import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import {  privateAxios } from "../axios";
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaRegEdit
} from 'react-icons/fa';
import { MdDeleteOutline } from "react-icons/md";


export const MyListing = () => {
  const [showListingsErr, setShowListingsErr] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const { currentUser } = useSelector(state => state.user);
   console.log("currentUser", currentUser?_id)

  useEffect(() => {
    const handleShowListings = async () => {
      try {
        setShowListingsErr(false);
        const res = await privateAxios.get(`/user/listings/${currentUser?._id}`, {
          headers: {
            Authorization: `${currentUser.token}`,
          },
        });
       
        if (res.success === false) {
          setShowListingsErr(true);
        }
        setUserListings(res.data);
      } catch (err) {
        setShowListingsErr(true);
      }
    };
    handleShowListings();
  }, [currentUser._id]);

  const handleListingDelete = async (listingId) => {
    try {
      const res = await privateAxios.delete(`/listing/delete/${listingId}`,{
        headers: {
          Authorization: `${currentUser.token}`,
        },
      });
      if (res.success === false) {
        // console.log(res.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      // console.log(error);
    }
  };

  const handleListingEdit = async (listingId) => {
    try {
      const res = await privateAxios.post(`/listing/edit/${listingId}`,{
        headers: {
          Authorization: `${currentUser.token}`,
        },
      });
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center gap-4  px-4 lg:px-48'>
      <h1 className='text-center my-7 text-2xl font-semibold'>Your Listing</h1>
      {userListings && userListings.length > 0 && (
        <>
          {userListings.map((listing) => (
            <div
              className=" bg-gray-100  shadow-md rounded-lg p-3 gap-3 flex   flex-wrap justify-between lg:gap-5 border lg:w-[68vw] border-slate-200  "
              key={listing._id}
            >
              <Link to={`/listings/${listing._id}`}>
                <div  className="flex  h-52 w-[90vw] md:h-40 md:w-52 lg:h-40  lg:w-52 ">
                  <img
                    className=" w-full  h-full object-cover"
                    src={listing.imageUrls}
                    alt="Listing cover"
                  />
                </div>
              </Link>
              <Link className="flex-1" to={`/listings/${listing._id}`}>
                <div  className="flex flex-col gap-5  mt-5 ">
                  <p className="text-slate-700  font-semibold hover:underline truncate w-full">
                    {listing.name}
                  </p>
                  <div className='flex  flex-wrap  gap-3 items-center lg:gap-6'>
                            <p className='  text-gray-600 text-center  border border-gray-100 py-1 rounded-xl text-ellipsis font-semibold'>
                           {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                           </p> 
                    <div className=" flex  items-center">
                      <MdLocationOn className='h-4 w-4 text-green-700' />
                      <p className='text-sm  capitalize text-gray-600 truncate w-full'>
                       {listing.address}
                      </p>
                    </div>
                    </div>
                     <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                             <li className='flex items-center gap-1 whitespace-nowrap '>
                              <FaBed className='text-lg' />
                              {listing.bedrooms > 1
                             ? `${listing.bedrooms} beds `
                            : `${listing.bedrooms} bed `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaBath className='text-lg' />
                            {listing.bathrooms > 1
                             ? `${listing.bathrooms} baths `
                           : `${listing.bathrooms} bath `}
                             </li>
                             <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaParking className='text-lg' />
                             {listing.parking ? 'Parking spot' : 'No Parking'}
                          </li>
                          <li className='flex items-center gap-1 whitespace-nowrap '>
                           <FaChair className='text-lg' />
                          {listing.furnished ? 'Furnished' : 'Unfurnished'}
                          </li>  
                        </ul>
                </div>
              </Link>
              <div  className="flex flex-col gap-5 justify-between my-2  mr-5">
                <div className="flex  gap-3    flex-wrap lg:gap-6">
                  <p className="font-semibold text-gray-600  text-lg ">$
                              
                               {listing.offer
                               ? listing.discountPrice.toLocaleString('en-US')
                               : listing.regularPrice.toLocaleString('en-US')}
                               <span className=" m-0 opacity-30">{listing.type === 'rent' && '/month'}</span>
                               </p>
                               {listing.offer && (<p className=" text-red-700 text-xl py-1 px-2 rounded-lg z-10   text-ellipsis font-bold ">
                                 <span>{Math.round(((listing.regularPrice - listing.discountPrice) / listing.regularPrice ).toLocaleString('en-US') * 100)}%</span><span  > OFF</span>
                               </p>
                                )}
                </div>
                        
                <div className="flex  flex-wrap gap-4 lg:gap-6 ">
                  <button onClick={() => handleListingDelete(listing._id)} className="text-slate-500 py-3 px-7   border border-slate-300 cursor-pointer rounded-md  hover:opacity-80 uppercase ">
                    <MdDeleteOutline/>
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button onClick={() => handleListingEdit(listing._id)} className="text-slate-500 py-3 px-7 border  border-slate-300 cursor-pointer   rounded-md hover:opacity-80 uppercase">
                      <FaRegEdit/>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
