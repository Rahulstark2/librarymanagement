import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Landing from './pages/Landing';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import Home from './pages/Home';
import AdminMaintenance from './pages/AdminMaintenance';
import Reports from './pages/Reports';
import Transactions from './pages/Transactions';

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
        <Route path="/adminhome/reports" element={<Reports />}/>
        <Route path="/userhome" element={<Home />}/>
        <Route path="/userhome/reports" element={<Reports />}/>
        <Route path="/adminhome/transactions" element={<Transactions />}/>

        
        

        
      </Routes>
      
    </BrowserRouter>
    </div>
  )
}

export default App
