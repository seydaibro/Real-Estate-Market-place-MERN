import {BrowserRouter,Routes, Route} from 'react-router-dom'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Profile } from './pages/Profile'
import { Signin } from './pages/Signin'
import { SignUp } from './pages/Signout'
import { Header } from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import { CreateListing } from './pages/CreateListing'
import { UpdateListing} from './pages/UpdateListing'
import { Listing } from './pages/Listing'
import { Search } from './pages/Search'
import { MyListing } from './pages/MyListing'
import './App.css'
// import Sidebar from './components/Sidebar'


export const App = () => {
  return <BrowserRouter>
  <Header/>
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/sign-in' element={<Signin/>}/>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/search'  element={<Search/>}/>
          <Route path='/listings/:listingId'  element={<Listing/>}/>
          <Route element={<PrivateRoute/>}>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/create-listing' element={<CreateListing/>}/>
          {/* <Route path='/sidebar' element={<Sidebar/>}/> */}
          <Route path='/update-listing/:listingId' element={<UpdateListing/>}/>
          <Route  path='/mylisting'  element={<MyListing/>}/>
          </Route>
      </Routes>
  </BrowserRouter>
   
}
