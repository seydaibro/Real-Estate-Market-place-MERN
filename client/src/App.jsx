import {BrowserRouter,Routes, Route} from 'react-router-dom'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Profile } from './pages/Profile'
import { Signin } from './pages/Signin'
import { Signout } from './pages/Signout'
import { Header } from './components/Header'


export const App = () => {
  return <BrowserRouter>
  <Header/>
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/sign-in' element={<Signin/>}/>
          <Route path='/sign-out' element={<Signout/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/profile' element={<Profile/>}/>
        
      </Routes>
  </BrowserRouter>
   
}
