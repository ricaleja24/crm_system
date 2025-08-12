import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index';
import { useSelector } from 'react-redux';

// Components
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Contacts from './pages/Contacts';
import Companies from './pages/Companies';
import Opportunities from './pages/Opportunities';
import Tasks from './pages/Tasks';
import Activities from './pages/Activities';
import Campaigns from './pages/Campaigns';

// Auth wrapper component
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { token } = useSelector((state: any) => state.auth);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useSelector((state: any) => state.auth);
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/dashboard" element={
              <AuthWrapper>
                <Dashboard />
              </AuthWrapper>
            } />
            <Route path="/leads" element={
              <AuthWrapper>
                <Leads />
              </AuthWrapper>
            } />
            <Route path="/contacts" element={
              <AuthWrapper>
                <Contacts />
              </AuthWrapper>
            } />
            <Route path="/companies" element={
              <AuthWrapper>
                <Companies />
              </AuthWrapper>
            } />
            <Route path="/opportunities" element={
              <AuthWrapper>
                <Opportunities />
              </AuthWrapper>
            } />
            <Route path="/tasks" element={
              <AuthWrapper>
                <Tasks />
              </AuthWrapper>
            } />
            <Route path="/activities" element={
              <AuthWrapper>
                <Activities />
              </AuthWrapper>
            } />
            <Route path="/campaigns" element={
              <AuthWrapper>
                <Campaigns />
              </AuthWrapper>
            } />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;