// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/Dashboard';
import Home from './pages/Home';
import Deposits from './pages/Deposits';
import Timezone from './pages/Timezone';
import Withdrawals from './pages/withdraws';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="deposits" element={<Deposits />} />
          <Route path="timezone" element={<Timezone />} />
          <Route path="withdraws" element={<Withdrawals />} />

         

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
