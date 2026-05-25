import { Routes, Route, Navigate } from 'react-router-dom';
import ReportForm from './pages/public/ReportForm';
import TrackTicket from './pages/public/TrackTicket';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminReportDetail from './pages/admin/ReportDetail';
import MainLayout from './layouts/MainLayout'; // <-- Import Layout Baru Anda

function PrivateRoute({ children }) {
    const token = localStorage.getItem('admin_token');
    return token ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
    return (
        <Routes>
            {/* 🟢 Halaman Publik (Dibungkus di dalam MainLayout agar punya Header & Footer Notion) */}
            <Route path="/" element={
                <MainLayout><ReportForm /></MainLayout>
            } />
            <Route path="/track" element={
                <TrackTicket />
            } />

            {/* 🔴 Halaman Admin Panel (Tidak perlu pakai layout publik) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/reports" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/reports/:id" element={<PrivateRoute><AdminReportDetail /></PrivateRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
