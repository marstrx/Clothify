import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');

    if (!adminToken || !adminUser.is_admin) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
  if (!adminUser.is_admin) {
    return null;
  }

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-user-info">
          <span>Welcome, {adminUser.name}</span>
          <button
            className="admin-logout-btn"
            onClick={() => {
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_user');
              navigate('/admin/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;