import {useEffect, useState} from 'react'
import {app} from '../firebase'
import {getDownloadURL, getStorage, ref,
       uploadBytesResumable} from 'firebase/storage'
import { privateAxios } from '../axios'
import { useSelector } from 'react-redux'
import { useNavigate, useParams} from 'react-router-dom'





export const UpdateListing = () => {
    const navigate = useNavigate()
    const {currentUser} = useSelector(state => state.user)
    const [files, setFiles] = useState([])
    const params = useParams()
    const [formData, setFormData] = useState({
       imageUrls:[], 
       name:'',
       description:'',
       address: '',
       type: 'rent',
       bedrooms: 1,
       bathrooms: 1,
       regularPrice: 50,
       discountPrice:0,
       offer:false,
       parking: false,
       furnished: false,
       useerRef:currentUser._id

    })
    const [imageUploadError, setImageUploadError] = useState(null)
 const [uploading, setUploading] = useState(false)
 const [error, setError] = useState(false)
 const [loading, setLoading] = useState(false)
    // console.log(files)
    // console.log(formData)


    useEffect(()=>{
    const fetchListing = async()=>{
      const listingId = params.listingId
      const res = await privateAxios.get(`/listing/get/${listingId}`)
      if(res.success === false){
        // console.log(res.message)
        return
      }
      setFormData(res.data)
    }
    fetchListing()
    },[])


    const handleImageSubmit = (e) => {
        e.preventDefault();
    
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = [];
    
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
    
            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setImageUploadError(false);
                    setUploading(false)
                })
                .catch((error) => {
                    // Fix the closing parenthesis here
                    setUploading(false)
                    setImageUploadError('Image upload failed (2 MB max per image)');
                    
                });
        } else {
            setUploading(false)
            setImageUploadError('You can only upload 6 images per listing');
        }
        
    };
    


const storeImage = async (file) => {
    try {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const snapshot = await uploadBytesResumable(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        // console.error("Error storing image:", error);
        throw error; // Re-throw the error to be caught by the Promise.reject in Promise.all
    }
};

const handleRemoveImage = (index) =>{
setFormData({
    ...formData,
    imageUrls: formData.imageUrls.filter((_, i)=> i !== index)
})
}

const handleChange = (e)=>{
if(e.target.id === 'sale' || e.target.id === 'rent'){
    setFormData({
        ...formData,
        type:e.target.id
    })
}
if(e.target.id === 'parking' ||  e.target.id === 'furnished' || e.target.id === 'offer'){
    setFormData({
        ...formData,
        [e.target.id]: e.target.checked 
    })
}
if(e.target.type === 'number'|| e.target.type === 'text' || e.target.type === 'textarea'){
    setFormData({
        ...formData,
        [e.target.id]: e.target.value
    })
}
}
const hanldeSubmit = async(e) =>{
    e.preventDefault()
    try{
        if(formData.imageUrls.length < 1) return setError('You must upload at least one image')
        if(formData.regularPrice < formData.discountPrice) return setError('Discount price must be less than regular price')
        setLoading(true)
        setError(false)
        const res = await privateAxios.post('/listing/edit/'+params.listingId, formData,{
            headers: {
                Authorization: ` ${currentUser.token}`,
              //   'Content-Type': 'multipart/form-data', // Assuming you are sending formData
              },
        })
        setLoading(false)
        navigate(`/listings/${res.data._id}`)
        if(res.success === false){
         setError(res.massage)
        }

    }catch(error){
setError(error.message)
setLoading(false)
    }
   
}
  return (
    <main  className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7' >Update Listing</h1>
        <form onSubmit={hanldeSubmit}
        action="" className='flex gap-10 flex-col sm:flex-row'>
         <div className='flex flex-col  gap-4  flex-1'>
             <input type="text"
              placeholder='Name'
              className='border p-3
              rounded-lg' id='name'
              maxLength='62'
              minLength='10'
              required 
              onChange={handleChange}
              value={formData.name}
              />
              
             <textarea type="text"
              placeholder='Description'
              className='border p-3
              rounded-lg' id='description'
              required
              onChange={handleChange}
              value={formData.description} />
             <input type="text"
              placeholder='Address'
              className='border p-3
              rounded-lg' id='address'
              onChange={handleChange}
              value={formData.address}
              required />
              <div  className='flex gap-16 flex-wrap'>
                <div className='flex gap-2' >
                    <input type="checkbox"
                      id='sale' className='w-5' 
                      onChange={handleChange}
                      checked={formData.type === 'sale'} />
                    <span>Sell</span>
                </div>
                <div className='flex gap-2' >
                    <input type="checkbox" 
                     id='rent' className='w-5' 
                     onChange={handleChange}
                     checked={formData.type === "rent"} />
                    <span>Rent</span>
                </div>
                <div className='flex gap-2' >
                    <input type="checkbox" 
                     id='parking' className='w-5' 
                     onChange={handleChange}
                     checked={formData.parking}
                     />
                    <span>Parking spot</span>
                </div>
                <div className='flex gap-2' >
                    <input type="checkbox" 
                     id='furnished' className='w-5'
                     onChange={handleChange}
                     checked={formData.furnished}  />
                    <span>Furnished</span>
                </div>
                <div className='flex gap-2' >
                    <input type="checkbox" 
                     id='offer' className='w-5'  
                     onChange={handleChange}
                     checked={formData.offer}/>
                    <span>Offer</span>
                </div>
              </div>
              <div className=' flex flex-wrap gap-6' >
                <div className='flex items-center gap-2'>
                <input type="number"
                 id='bedrooms' 
                  min='1' max='10'
                 className='p-3 
                 focus:outline-none  border-grey-300 
                 rounded-lg'
                 onChange={handleChange}
                 value={formData.bedrooms}
                 />
                <span>Beds</span>
                </div>
                <div className='flex items-center gap-2'>
                <input type="number"
                 id='bathrooms' 
                  min='1' max='10'
                 className='p-3 
                 focus:outline-none  border-grey-300 
                 rounded-lg'
                 onChange={handleChange}
                 value={formData.bathrooms}
                 />
                <span>Baths</span>
                </div>
                <div className='flex items-center gap-2'>
                <input type="number"
                 id='regularPrice' 
                  min='1' max='10000000000'
                 className='p-3 
                 focus:outline-none  border-grey-300 
                 rounded-lg'
                 onChange={handleChange}
                 value={formData.regularPrice}
                 />
                 <div className='flex flex-col items-center'>
                 <p>Regular Price</p>
                 <span className='text-xs'>( $ / month)</span>
                 </div>
                
                </div>
                {formData.offer && (
               < div className='flex items-center gap-2'>
                <input type="number"
                 id='discountPrice' 
                 min='1' max='10000000000'
                 className='p-3 
                 focus:outline-none border
                 rounded-lg'
                 onChange={handleChange}
                 value={formData.discountPrice}
                 />
                 <div className='flex flex-col items-center'>
                 <p>Discounted Price</p>
                 <span className='text-xs'> ($ / month)</span>
                 </div>
                
                </div>
                )}
             
              </div>
         </div>
         <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images:
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
            </p>
           <div className=' flex gap-4 ' >
            <input  
            onChange={(e)=>setFiles(e.target.files)}className=' w-full p-3 border 
            border-gray-300'
             type="file"
              id='images'
              accept='image/*' 
              multiple />
            <button
             disabled={uploading}
              type='button'
               onClick={
               (e)=> handleImageSubmit(e)}
             className='  rounded-lg
             p-3 text-green-700
              border border-green-700
               hover:shadow-lg
              disabled:opacity-80'>
                {uploading ? 'Uploading...': 'Upload' }
                </button>
           </div>
           <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
         {
         formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
       <div 
        key={url}className='
        flex justify-between
        p-3 border items-center '>
       <img className='w-40 h-40 object-cover rounded-lg'
            src={url} alt="listing image" />
            <button type='button' onClick={ () => handleRemoveImage(index)} className='text-red-700 p-3 rounded-lg border border-red-700 uppercase hover:opacity-90'>Delete</button>
    </div>
        
    ))
}          <button  disabled={loading || uploading}className='p-3
    
          bg-slate-700 text-white
           uppercase  rounded-lg
            hover:opacity-95 
            disabled:opacity-80'>
               {loading? "updating..":"update listing"}
               </button>
               {error && <p className='text-red-700 text-sm'>{error}</p>}
         </div>
         
        
        </form>
    </main>
  )
}

