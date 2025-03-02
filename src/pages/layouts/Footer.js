import React from 'react';
import './style/footer.css';
import logo from '../../images/Logo.png';
import { FaFacebook, FaTiktok, FaTwitter } from 'react-icons/fa'; 

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                <img src={logo} alt="Logo" className="logo-img" />
                </div>
                <div className="footer-text">
                    <p>Texto de ejemplo para el footer.</p>
                    <p>Correo: <a href="mailto:Example@example.com">Example@example.com</a></p>
                </div>
                <div className="footer-social">
                    <a href="https://facebook.com" className="social-link"><FaFacebook /></a>
                    <a href="https://tiktok.com" className="social-link"><FaTiktok /></a>
                    <a href="https://twitter.com" className="social-link"><FaTwitter /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;