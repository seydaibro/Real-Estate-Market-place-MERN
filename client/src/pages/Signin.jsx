
import {useState , useRef, useEffect}from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {makeRequest}  from '../../src/axios'
import {
   signInStart,
   signInSuccess, 
   signInFailure
       } from '../redux/user/UserSlice'
import { useSelector, useDispatch } from 'react-redux';
import OAuth  from '../components/OAuth';

export const Signin = () => {
 const [formData, setFormData] = useState({})
//  onst [error, setErorr] = useState(nullc)
//  const [loading, setLoading] = useState(false)
const navigate = useNavigate()
const dispatch = useDispatch()

const isMounted = useRef(true)

const {loading, error} = useSelector((state) =>state.user)
  const handleChange = (e)=>{
   
  setFormData({
    ...formData,
    [e.target.id]: e.target.value
  })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      dispatch(signInStart());
  
      const response = await makeRequest.post('/auth/signin', formData);
      if (response.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
  
      dispatch(signInSuccess(response.data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form 
      onSubmit={handleSubmit}
      className='flex flex-col gap-4'>
        
        <input
         autoComplete="off"
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg  focus:outline-none'
          id='email'
          onChange={handleChange}
        />
        <input
         autoComplete="off"
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg focus:outline-none'
          id='password'
          onChange={handleChange}
        />

        <button disabled={loading}  className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
         { loading? 'Loading...': 'Sign In'}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p> Dont have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
     { error && <p className='text-red-500 mt-5'>{error}</p>}
     
    </div>
  );
};
