import { 
  logOutUserStart,
  logOutUserSuccess,
  logOutUserFailure,
} from '../redux/user/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { privateAxios } from '../axios';
import { Link } from 'react-router-dom';

export const Dropdown = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector(state => state.user);
  
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      dispatch(logOutUserStart());
      const res = await privateAxios.get('/auth/signout');
      if (res.success === false) {
        dispatch(logOutUserFailure(res.data.message));
        return;
      }
      dispatch(logOutUserSuccess());
    } catch (err) {
      dispatch(logOutUserFailure(err.response.data.message));
    }
  };
  console.log("currentuserfromdero", currentUser)

  return (
    currentUser.token && (
      <div className=" inline-block text-left">
        <div className="hidden group-hover:block hover:block origin-top-right absolute right-2 top-7 w-32 rounded-md shadow-md bg-slate-100 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <Link to='/profile' className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200" role="menuitem">
              Profile
            </Link>
            <Link to='/mylisting' className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200" role="menuitem">
              My Listings
            </Link>
            <Link onClick={handleSignOut} className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-slate-200" role="menuitem">
              Logout
            </Link>
          </div>
        </div>
      </div>
    )
  );
};
