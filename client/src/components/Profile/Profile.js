import React, { useState, useEffect } from 'react';
import api from '../../api';
import Navbar from '../Navbar';
import '../../styles/Profile.css'; // Scoped CSS file for Profile page

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/auth/profile?userId=${userId}`);
        setUser(response.data);
        setEditData(response.data); // Prepopulate edit fields
      } catch (error) {
        alert("Failed to load profile data. " + (error.response?.data || error.message));
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await api.put(`/auth/profile/${userId}`, editData);
      setUser(response.data);
      setIsEditing(false);
      alert('Profile updated successfully.');
    } catch (error) {
      alert('Failed to update profile. ' + (error.response?.data || error.message));
    }
  };

  return (
    <>
      <div className="profile-container">
      <Navbar />

        <h2>My Profile</h2>
        {user ? (
          <div>
            {!isEditing ? (
              <div className="profile-details">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Aadhar:</strong> {user.aadhar}</p>
                <button onClick={() => setIsEditing(true)} className="edit-btn">
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="edit-profile-form">
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  placeholder="Name"
                />
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                <input
                  type="text"
                  name="aadhar"
                  value={editData.aadhar}
                  onChange={handleChange}
                  placeholder="Aadhar"
                />
                <button onClick={handleSave} className="save-btn">Save</button>
                <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default Profile;
