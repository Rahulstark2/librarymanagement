import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Landing from './pages/Landing';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import Home from './pages/Home';
import AdminMaintenance from './pages/AdminMaintenance';

function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/userlogin" element={<UserLogin />}/>
        <Route path="/adminhome" element={<Home />}/>
        <Route path="/adminhome/adminmaintenance" element={<AdminMaintenance />}/>
        

        
      </Routes>
      
    </BrowserRouter>
    </div>
  )
}

export default App
