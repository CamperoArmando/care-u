import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateIncident from './pages/CreateIncident';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import AdminRoute from './components/AdminRoute'; 
import UserManagement from './pages/UserManagement'; 
import CreateAlert from './pages/CreateAlert';
import AlertFeed from './pages/AlertFeed';  // Nuevo

function PrivateRoute({ children }){
  const { token, user } = useAuth();

  // si hay usuario O token, permite acceso
  return (user || token) ? children : <Navigate to="/login" replace />;
}


export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/feed" element={<PrivateRoute><Feed/></PrivateRoute>} />
          <Route path="/new" element={<PrivateRoute><CreateIncident/></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><UserManagement /></AdminRoute>}/>
          <Route path="/create-alert" element={<PrivateRoute><CreateAlert /></PrivateRoute>} /> 
          <Route path="/alert-feed" element={<PrivateRoute><AlertFeed /></PrivateRoute>} /> 
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
