import {useEffect, useState} from 'react'
import {  privateAxios } from '../axios'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const Contact = ({listing}) => {
    // console.log(listing.useerRef)
    const { currentUser } = useSelector(state => state.user);
    const [landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState('');
    const onChange = (e) => {
        setMessage(e.target.value);
      };
   
    useEffect(()=>{
      const fetchLandlord = async() =>{
        try{
         const res = await privateAxios.get(`user/${listing.useerRef}`,{
          headers: {
            Authorization: ` ${currentUser.token}`,
          //   'Content-Type': 'multipart/form-data', // Assuming you are sending formData
          },
         })
       
         setLandlord(res.data)
        }catch(err){
          // console.log(err)
        }
      }
      fetchLandlord()
    },[listing.useerRef])
  return (
    <>
    {landlord && (
        <div className='flex gap-3 flex-col'>
           <p>Contact <span>{landlord.username  }</span>
           for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
           </p>
           <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg '
          ></textarea>
             <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
         
          className= ' w-full text-center bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95 leading-3'
          >
            Send Message          
          </Link>
        </div>
    )}
  
    </>
  )
}
