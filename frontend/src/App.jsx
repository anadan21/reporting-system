import { Routes, Route, Navigate } from 'react-router-dom';
import ReportForm from './pages/public/ReportForm';
import TrackTicket from './pages/public/TrackTicket';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminReportDetail from './pages/admin/ReportDetail';

// Guard untuk halaman admin
function PrivateRoute({ children }) {
    const token = localStorage.getItem('admin_token');
    return token ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
    return (
        <Routes>
            {/* Halaman publik */}
            <Route path="/" element={<ReportForm />} />
            <Route path="/track" element={<TrackTicket />} />

            {/* Halaman admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/reports" element={
                <PrivateRoute><AdminDashboard /></PrivateRoute>
            } />
            <Route path="/admin/reports/:id" element={
                <PrivateRoute><AdminReportDetail /></PrivateRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}