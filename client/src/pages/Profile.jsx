import {useSelector} from 'react-redux'
import { useRef , useState, useEffect} from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable,} from 'firebase/storage'
import {app}  from '../firebase'

export const Profile = () => {
  const fileRef = useRef(null)
  const[filePerc, setFilePerc] = useState(0)
  const [file, setFile] = useState(undefined)
  const [fileUploadErr, setFileUploadErr] = useState(false)
  const {currentUser} = useSelector(state => state.user)
  const [formData, setFormData] = useState({})
  console.log(formData)
  console.log(filePerc)
  console.log(fileUploadErr)

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
  return (
    <div  className='p-3  max-w-lg   mx-auto'>
      <h1 className="text-3xl font-semibold text-center">
        Profile
        </h1>
        <form action="" className='flex flex-col gap-4'>
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
          className='border p-3 rounded-lg
          focus: outline-none
          '
          />
          <input type="email" 
          id='email'
           placeholder='email'
          className='border p-3 rounded-lg
          focus: outline-none'
          />
          <input type="text" 
          id='password'
           placeholder='password'
          className='border p-3 rounded-lg
          focus: outline-none'
          />
        <button 
        className='bg-slate-700 p-3 uppercase
         text-white rounded-md  hover:opacity-95
         disabled:opacity-80'>
          Update</button>
        </form>
        <div className='flex  justify-between mt-5'>
          <span className='text-red-700 cursor-pointer'>Dlete account</span>
          <span className='text-red-700 cursor-pointer'>Sign out</span>
        </div>
    </div>
  )
}
