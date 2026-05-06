import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import PrivateRoute from './components/Auth/PrivateRoute';

// Pages publiques
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

// Pages protégées
import Profile from './pages/Profile';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import EditJob from './pages/EditJob';
import MyApplications from './pages/MyApplications';
import JobApplications from './pages/JobApplications';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              {/* Routes protégées - Tous connectés */}
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              
              {/* Routes protégées - Recruteur/Admin */}
              <Route path="/post-job" element={
                <PrivateRoute allowedRoles={['recruiter', 'admin']}>
                  <PostJob />
                </PrivateRoute>
              } />
              <Route path="/my-jobs" element={
                <PrivateRoute allowedRoles={['recruiter', 'admin']}>
                  <MyJobs />
                </PrivateRoute>
              } />
              <Route path="/edit-job/:id" element={
                <PrivateRoute allowedRoles={['recruiter', 'admin']}>
                  <EditJob />
                </PrivateRoute>
              } />
              <Route path="/jobs/:id/applications" element={
                <PrivateRoute allowedRoles={['recruiter', 'admin']}>
                  <JobApplications />
                </PrivateRoute>
              } />
              
              {/* Routes protégées - Candidat uniquement */}
              <Route path="/my-applications" element={
                <PrivateRoute allowedRoles={['candidate']}>
                  <MyApplications />
                </PrivateRoute>
              } />
              
              {/* Routes protégées - Admin uniquement */}
              <Route path="/admin" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;