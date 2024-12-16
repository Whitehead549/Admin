// src/App.js
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/Dashboard';
import Home from './pages/Home';
import Deposits from './pages/Deposits';
import Timezone from './pages/Timezone';
import Withdrawals from './pages/withdraws';
import Registration from './pages/Registration';
import Users from './pages/Users';
import TransHash from './pages/TransHash';



function App() {
  return (
    <Router>
      <Routes>
       <Route index element={<Registration />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route path="users" element={<Users />} />
          <Route path="Dashboard" element={<Home />} />          
          <Route path="deposits" element={<Deposits />} />
          <Route path="hash" element={<TransHash />} />
          <Route path="timezone" element={<Timezone />} />
          <Route path="withdraws" element={<Withdrawals />} />

         

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
