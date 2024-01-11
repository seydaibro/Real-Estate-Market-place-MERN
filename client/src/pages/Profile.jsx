import {useSelector, useDispatch} from 'react-redux'
import { useRef , useState, useEffect} from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable,} from 'firebase/storage'
import {app}  from '../firebase'
import {makeRequest }from '../axios'
import {Link} from 'react-router-dom'
import { updateUserStart,
       updateUserSuccess,
       updateUserFailure ,
       deleteUserStart,
       deleteUserSuccess,
       deleteUserFailure,
       logOutUserStart,
        logOutUserSuccess,
        logOutUserFailure,
        signInFailure} from '../redux/user/UserSlice'
    

export const Profile = () => {
  const [showListingsErr, setShowListingsErr] = useState(null)
  const fileRef = useRef(null)
  const[filePerc, setFilePerc] = useState(0)
  const[userListings, setUserListings] = useState([])
  const [file, setFile] = useState(undefined)
  const [fileUploadErr, setFileUploadErr] = useState(false)
  const {currentUser, loading,  error} = useSelector(state => state.user)
  const [formData, setFormData] = useState({})
  const dispatch = useDispatch()
 
  

  useEffect(() =>{
  if(file){
    handleFileUpload(file)
  }
  },[file])

  const handleFileUpload = (file) =>{
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage , fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
    
  } 

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async(e) =>{
    e.preventDefault()
    try{
      dispatch(updateUserStart())
      const response = await makeRequest.post(`/user/update/${currentUser._id}`, formData);
      if (response.success === false) {
        console.log(response)
        dispatch(updateUserFailure(response.message));
        return;
      }
      dispatch(updateUserSuccess(response.data));
      
    }catch(error){
      dispatch(updateUserFailure(error.response.data.message))
      console.log(error)
    }
  }

  const handleDeleteUser = async(e) =>{
      e.preventDefault()
      dispatch(deleteUserStart())
      try{
        const response = await makeRequest.delete(`/user/delete/${currentUser._id}`, formData);
        if (response.success === false){
          dispatch(deleteUserFailure(response.data.message))
          return   
        }
        dispatch(deleteUserSuccess(response.data))
        console.log(response)
      }catch(err){
        dispatch(deleteUserFailure(err.response.datamessage))
      }

  }

  const handleSignOut = async(e) =>{
    e.preventDefault()
     try{
     dispatch(logOutUserStart())
     const res = await makeRequest.get('/auth/signout')
      if(res.sucess === false){
      dispatch(signInFailure(res.data.message))
      return
      }
      dispatch(logOutUserSuccess())
     }catch(err){
      console.log(err)
      dispatch(logOutUserFailure(err.response.data.message))
      }
      
     
  }
console.log(userListings)
  const handleShowListings =  async()=>{
    try{
       setShowListingsErr(false)
       const res = await makeRequest.get(`user/listings/${currentUser._id}`)
       if(res.success === false){
        setShowListingsErr(true)
       }
       setUserListings(res.data)
    }catch(err){
   setShowListingsErr(true)
    }
  }

  const handleListingDelete = async(listingId)=>{
 try{
 const res = await makeRequest.delete(`/listing/delete/${listingId}`)
 if(res.sucess == false){
  console.log(res.message)
  return
 }
 setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))
 }catch(error){
  console.log(error)
 }
  }

  const handleListingEdit = async(listingId)=>{
    try{
   const res = await makeRequest.post(`/listing/edit/${listingId}`)
    }catch(err){
      console.log(err)
    }
  }
  return (
    <div  className='p-3  max-w-lg   mx-auto'>
      <h1 className="text-3xl font-semibold text-center">
        Profile
        </h1>
        <form onSubmit={handleSubmit}
         className='flex flex-col gap-4'>
          <input onChange={(e) => setFile(e.target.files[0])}
           type="file" 
           ref={fileRef} 
           accept='image/*'
           hidden/>
          <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar} alt="Profile" 
          className='rounded-full h-24 w-24
           object-cover cursor-default self-center mt-2'

          />
           <p className='text-sm self-center'>
          {fileUploadErr ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>


          <input type="text" 
          id='username'
           placeholder='username'
           defaultValue={currentUser.username}
          className='border p-3 rounded-lg
          focus: outline-none'
          onChange={handleChange}
          />
          <input type="email" 
          id='email'
           placeholder='email'
           defaultValue={currentUser.email}
          className='border p-3 rounded-lg
          focus: outline-none'
          onChange={handleChange}
          />
          <input type="text" 
          id='password'
           placeholder='password'
          className='border p-3 rounded-lg
          focus: outline-none'
          onChange={handleChange}
          />
        <button 
        className='bg-slate-700 p-3 uppercase
         text-white rounded-md  hover:opacity-95
         disabled:opacity-80'>
         
          {loading ? 'Loading': 'update'}
          </button>
          <Link to='/create-listing' className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover: opacity-95'>
          Create Listing
          </Link>
        </form>
        <div className='flex  justify-between mt-5'>
          <span onClick={handleDeleteUser} className='text-red-700 focus:opacity-90 cursor-pointer'>Dlete account</span>
          <span  onClick={handleSignOut}  className='text-red-700 cursor-pointer'>Sign out</span>
        </div>
        <p className='text-red-700 mt-5'>{error ? error : ''}</p>
        <button onClick={handleShowListings}className='text-green-700 w-full' >Show Listigns</button>
        <p className='text-red-700 text-sm'>{showListingsErr? 'Error show listings': ''}</p>
        {userListings && userListings.length > 0 && (
  <div  className='flex flex-col gap-4'>
    <h1  className='text-center my-7 text-2xl font-semibold'>Your Listing</h1>
    {userListings.map((listing) => (
      <div 
        className="border rounded-lg p-3 gap-4 flex justify-between items-center border-slate-200"
        key={listing._id}
      >  
        <Link to={`/listing/${listing._id}`}>
          <img
            className="h-16 w-16 object-contain"
            src={listing.imageUrls}
            alt="Listing cover"
          />
        </Link>
        <Link className="flex-1" to={`/listing/${listing._id}`}>
          <p className="text-slate-700 font-semibold hover:underline truncate">
            {listing.name}
          </p>
        </Link>
        <div className="flex flex-col items-center gap-3">
          <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700 uppercase ">Delete</button>
          <Link to={`/update-listing/${listing._id}`}>
          <button  onClick={() => handleListingEdit(listing._id)}className="text-green-700 uppercase">Edit</button>
          </Link>
        </div>
      </div>
    ))}
  </div>
)}

        
    </div>
  )
}
