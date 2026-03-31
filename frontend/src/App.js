import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './redux/store';
import './styles/global.css';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import Specialties from './pages/Specialties';
import SpecialtyDetail from './pages/SpecialtyDetail';
import Clinics from './pages/Clinics';
import MyBookings from './pages/MyBookings';
import Admin from './pages/Admin';
import { Login, Register } from './pages/Auth';

const Layout = ({ children }) => (
  <>
    <Header />
    <main style={{ minHeight: 'calc(100vh - 68px)' }}>{children}</main>
    <Footer />
  </>
);

const AdminLayout = ({ children }) => (
  <>
    <Header />
    {children}
  </>
);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/doctors" element={<Layout><Doctors /></Layout>} />
          <Route path="/doctors/:id" element={<Layout><DoctorDetail /></Layout>} />
          <Route path="/specialties" element={<Layout><Specialties /></Layout>} />
          <Route path="/specialties/:id" element={<Layout><SpecialtyDetail /></Layout>} />
          <Route path="/clinics" element={<Layout><Clinics /></Layout>} />
          <Route path="/my-bookings" element={<Layout><MyBookings /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/admin/*" element={<AdminLayout><Admin /></AdminLayout>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
