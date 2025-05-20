import './App.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AddTableForm from './components/AddTableForm';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Auth from './components/Auth';
import { Box } from '@mui/material';
import OrderList from './components/OrderList';
import ReservationsList from './components/ReservationsList';
import Sidebar from './components/Sidebar';
import UserList from './components/UserProfileComponent';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/add-table" element={<AddTableForm />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/dashboard" element={<AnalyticsDashboard/>} />
              <Route path="/all-users" element={<UserList />} />
               <Route path="/reservations" element={<ReservationsList />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;