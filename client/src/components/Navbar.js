import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    // Toggle menu visibility on mobile
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Show logout modal
    const confirmLogout = () => {
        setShowLogoutModal(true);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
        setShowLogoutModal(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/home" className="navbar-logo">
                    Document Storage System
                </Link>
                <div className="navbar-menu-icon" onClick={toggleMenu}>
                    ☰
                </div>
                <ul className={`navbar-links ${menuOpen ? 'responsive' : ''}`}>
                    <li>
                        <Link to="/home" onClick={toggleMenu}>Home</Link>
                    </li>
                    
                    <li>
                        <Link to="/upload" onClick={toggleMenu}>Upload</Link>
                    </li>
                    <li>
                        <Link to="/share" onClick={toggleMenu}>Share</Link>
                    </li>
                    <li>
                        <Link to="/my-documents" onClick={toggleMenu}>My Documents</Link>
                    </li>
                    <li className="navbar-account">
                        Your Account
                        <div className="navbar-dropdown">
                            <Link to="/profile" onClick={toggleMenu}>Profile</Link>
                            <button onClick={confirmLogout} className="navbar-logout">Logout</button>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="logout-modal-overlay">
                    <div className="logout-modal">
                        <p>Are you sure you want to logout?</p>
                        <button onClick={handleLogout} className="confirm-logout-btn">
                            Yes, Logout
                        </button>
                        <button onClick={() => setShowLogoutModal(false)} className="cancel-logout-btn">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
