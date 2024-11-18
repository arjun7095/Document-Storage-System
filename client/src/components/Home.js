import React from "react";
import Navbar from "./Navbar";
import "../styles/Home.css"; // Import external CSS
import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <div className="home-container">
                <Navbar />
                <div className="home-content">
                    <h1>Welcome to Digital Document Storage</h1>
                    <p>
                        Your one-stop solution to securely store, manage, and access important documents online. 
                        Experience the convenience of having your documents at your fingertips, anytime and anywhere.
                    </p>
                    <div className="features">
                        <h2>Why Choose Us?</h2>
                        <ul>
                            <li>Secure and encrypted storage for all your important files.</li>
                            <li>Organized and easy-to-access digital document management.</li>
                            <li>Quick sharing options with secure links.</li>
                            <li>Access your documents anytime, anywhere on any device.</li>
                            <li>Hassle-free registration with OTP verification for added security.</li>
                        </ul>
                    </div>
                    <div className="cta">
                        <Link to='/upload' className="btn">Get Started</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
