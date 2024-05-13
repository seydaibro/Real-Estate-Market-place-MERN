import {FaSearch} from 'react-icons/fa'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import  { useSelector, useDispatch} from "react-redux"
import { useEffect, useState } from 'react';
import { Dropdown } from './Dropdown';
import { IoReorderThreeSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import {  privateAxios } from '../axios';
 
import { 
  logOutUserStart,
   logOutUserSuccess,
   logOutUserFailure,
  } from '../redux/user/UserSlice'
 


export const Header = () => {
  const {currentUser} = useSelector(state => state.user)
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      dispatch(logOutUserStart());
      const res = await privateAxios.get('/auth/signout');
      if (res.success === false) {
        dispatch(logOutUserFailure(res.data.message));
        return;
      }
    
      localStorage.removeItem('token');
      dispatch(logOutUserSuccess());
    } catch (err) {
      dispatch(logOutUserFailure(err.response.data.message));
    }
    toggleSidebar();
  };
  
  return (
    <header className="bg-slate-200 shadow-md sticky top-0 z-50 ">
        <div className="flex justify-between items-center align-middle max-w-6xl mx-auto p-3  ">
            <Link to='/'>
            <h1 className="font-bold size-sm sm:text-xl flex flex-wrap">
                <span className="text-slate-500">Seyda</span>
                <span className="text-slate-700">Estate</span>
            </h1>
            </Link>
            <form onSubmit={handleSubmit}
             className="bg-slate-100 p-3 
              rounded-lg 
              flex items-center">
                <input type="text"
                placeholder="Search..." 
                className="bg-transparent 
                 focus:outline-none
                   w-24 sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} />
                <button>
                <FaSearch className='text-slate-500'/>
                </button>
                
            </form>
           
            <ul className=' hidden  gap-4 justify-between items-center align-middle  md:flex '  >

                <Link to='/'>
              <li className='hidden sm:inline text-slate-900 hover:underline'>Home</li>  
              </Link>
              <Link to='/about'>
              <li className='hidden sm:inline text-slate-900 hover:underline'>About</li>
              </Link>
              <div  className=' flex flex-col'>
                
                      {currentUser? (
                       <div className='flex gap-4  justify-center '>
                         <Link to='create-listing'><li className='hidden sm:inline text-slate-900 hover:underline'>Create Listing</li>  </Link>
                          <div  className='group relative   flex items-center justify-center'>
                            <img  className='rounded-full h-7 w-7  flex items-center  justify-center cursor-pointer object-cover'
                            src={currentUser?.user.avatar} alt="Profile"/>
                            <Dropdown/>
                          </div>
                         
                       </div> 

                    ):
                      <Link  to='/sign-in'className='hidden  sm:inline text-slate-900 cursor-pointer  hover:underline'>Sign in</Link>  
                     
                      }
              </div>
            </ul>
            <div className='flex md:hidden'>
              <div className='flex gap-4 items-center'>
                <Link className='flex ' to='/sign-in'>{currentUser?'':'sign in'}</Link>
                <button className=' text-xl sm:text-2xl' onClick={toggleSidebar}>{isOpen ? <IoMdClose/> : <IoReorderThreeSharp/> }</button>
              </div> 
              {
  isOpen && (
    <ul className='fixed top-[72px] w-[50vw] right-0 bg-slate-300 scale-up-center h-screen p-5 flex flex-col gap-3'>
      <Link to='/'>
        <li onClick={toggleSidebar} className='sm:inline text-slate-900 hover:underline'>Home</li>
      </Link>
      <Link to='/about'>
        <li onClick={toggleSidebar} className='sm:inline text-slate-900 hover:underline'>About</li>
      </Link>
      <Link to='/create-listing'>
        <li onClick={toggleSidebar} className='sm:inline text-slate-900 hover:underline'>Create Listing</li>
      </Link>
      
      {currentUser && (
        
        <>
        <hr />
          <Link to={`/profile`}>
            <li onClick={toggleSidebar} className='sm:inline text-slate-900 hover:underline'>Profile</li>
          </Link>
          <Link to={`/mylisting`}>
            <li onClick={toggleSidebar} className='sm:inline text-slate-900 hover:underline'>My Listings</li>
          </Link>
          <li onClick={handleSignOut} className='sm:inline text-slate-900 hover:underline'>Logout</li>
        </>
      )}
    </ul>
  )
}

             </div>
           </div>
    </header>
  )
}
