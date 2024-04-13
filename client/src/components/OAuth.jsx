import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import {app} from '../firebase'
import {  publicAxios } from '../axios'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/UserSlice'
import { useNavigate } from 'react-router-dom'


export default function OAuth(){
const dispatch = useDispatch()
const navigate = useNavigate()
const handleGoogleClick = async() =>{
    try{
   const provider = new GoogleAuthProvider()
   const auth = getAuth(app)
   const result = await signInWithPopup(auth, provider)
   console.log(result)
 
   const res = await publicAxios.post('/auth/google',
   {
    name: result.user.displayName,
    email: result.user.email,
    photo:result.user.photoURL
}) 
dispatch(signInSuccess(res.data))
navigate('/')
    }catch(err){
        console.log(err)
    }
}
return(
    <button type='button'
    onClick={handleGoogleClick}
    className='
     bg-red-700 
     text-white p-3
     rounded-lg uppercase
     hover:opacity-95'
     >
      Continue with google
    </button>
)
}
 
