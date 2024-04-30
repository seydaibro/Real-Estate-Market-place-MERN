import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import {  privateAxios } from '../axios';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  
} from '../redux/user/UserSlice';
import { Link } from 'react-router-dom';

export const Profile = () => {
  const [showListingsErr, setShowListingsErr] = useState(null);
  const fileRef = useRef(null);
  const [filePerc, setFilePerc] = useState(0);
  const [userListings, setUserListings] = useState([]);
  const [file, setFile] = useState(undefined);
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const { currentUser, loading, error } = useSelector(state => state.user);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  console.log("currentuserToken",currentUser.token)
  console.log("currentuserFromProfile", currentUser)
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
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
  };
console.log(currentUser?.user._id)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await privateAxios.post(`/user/update/${currentUser?.user._id}`, formData,{
        headers: {
          Authorization: `${currentUser.token}`,
        },
      });
      if (response.success === false) {
        // console.log(response);
        dispatch(updateUserFailure(response.message));
        return;
      }
      dispatch(updateUserSuccess(response.data));
      console.log(response.data)
    } catch (error) {
        dispatch(updateUserFailure(error.response.data.message));
       console.log(error);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    dispatch(deleteUserStart());
    try {
      const response = await privateAxios.delete(`/user/delete/${currentUser?.user._id}`, formData, {
        headers: {
          Authorization: `${currentUser.token}`,
        },
      });
      if (response.success === false) {
        dispatch(deleteUserFailure(response.data.message));
        return;
      }
      dispatch(deleteUserSuccess(response.data));
      // console.log(response);
    } catch (err) {
      dispatch(deleteUserFailure(err.response.data.message));
    }
  };

  return (
    <div className='p-10 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold text-center"></h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          accept='image/*'
          hidden
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.user.avatar}
          alt="Profile"
          className='rounded-full h-24 w-24 object-cover cursor-default self-center mt-2'
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
        <input
          type="text"
          id='username'
          placeholder='username'
          defaultValue={currentUser.user.username}
          className='border p-3 rounded-lg focus: outline-none'
          onChange={handleChange}
        />
        <input
          type="email"
          id='email'
          placeholder='email'
          defaultValue={currentUser.user.email}
          className='border p-3 rounded-lg focus: outline-none'
          onChange={handleChange}
        />
        <input
          type="text"
          id='password'
          placeholder='password'
          className='border p-3 rounded-lg focus: outline-none'
          onChange={handleChange}
        />
        <button
          className='bg-slate-700 p-3 uppercase text-white rounded-md hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading' : 'update'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 focus:opacity-90 cursor-pointer'>
          Delete account
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
    </div>
  );
};
