import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleEditWordsClick = () => {
    navigate('/admin/edit-words');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <button 
        className="btn btn-primary" 
        onClick={handleEditWordsClick}
      >
        ערוך מאגר מילים
      </button>
    </div>
  );
}

export default AdminDashboard;
