import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { privateAxios } from '../axios';
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
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      if (currentUser && currentUser.user && currentUser.user._id) {
        const response = await privateAxios.post(
          `/user/update/${currentUser.user._id}`,
          formData,
          {
            headers: {
              Authorization: `${currentUser.token}`,
            },
          }
        );
        if (response.data.success === false) {
          dispatch(updateUserFailure(response.data.message));
          return;
        }
        dispatch(updateUserSuccess(response.data));
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    dispatch(deleteUserStart());
    if (currentUser && currentUser.user && currentUser.user._id) {
      try {
        const response = await privateAxios.delete(
          `/user/delete/${currentUser.user._id}`,
          {
            headers: {
              Authorization: `${currentUser.token}`,
            },
          }
        );
        if (response.data.success === false) {
          dispatch(deleteUserFailure(response.data.message));
          return;
        }
        dispatch(deleteUserSuccess(response.data));
      } catch (err) {
        dispatch(deleteUserFailure(err.response.data.message));
      }
    }
  };

  return (
    <div className='p-10 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center'></h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          accept='image/*'
          hidden
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser?.user?.avatar}
          alt='Profile'
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
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser?.user?.username}
          onChange={handleChange}
          required
          className='border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500 px-2 py-1'
        />
        <input
          type='text'
          id='email'
          placeholder='email'
          defaultValue={currentUser?.user?.email}
          onChange={handleChange}
          required
          className='border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500 px-2 py-1'
        />
        <input
          type='password'
          id='password'
          placeholder='password'
          defaultValue={currentUser?.user?.password}
          onChange={handleChange}
          required
          className='border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500 px-2 py-1'
        />
        <button
          type='submit'
          className='bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-700'
        >
          Update
        </button>
      </form>
      <p className='mt-4 text-center'>
        <button
          onClick={handleDeleteUser}
          className='text-red-500 underline hover:text-red-700'
        >
          Delete Account
        </button>
      </p>
      {showListingsErr && <p className='text-red-700 mt-4'>{showListingsErr}</p>}
      <div className='mt-4'>
        <h2 className='text-2xl font-semibold mb-2'>Your Listings</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <ul>
            {userListings.map((listing) => (
              <li key={listing._id}>
                <Link to={`/listing/${listing._id}`}>{listing.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};