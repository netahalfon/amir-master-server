import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter, Routes, Route,} from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import ForgotPassword from './ForgotPassword'






function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path = '/signUp' element = {<Signup />}></Route>
      <Route path = '/login' element = {<Login />}></Route>
      <Route path = '/Home' element = {<Home />}></Route>
      <Route path = '/ForgotPassword' element = {<ForgotPassword />}></Route>
      <Route path="/admin" element={<AdminDashboard />} />


    </Routes>
  </BrowserRouter>   

  )
}

export default App
