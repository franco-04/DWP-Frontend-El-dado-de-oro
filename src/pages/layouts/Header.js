import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './style/Header.css';
import logo from '../../images/Logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <header className="header">
            <NavLink to={user ? "/juegos" : "/"} exact> {/* Cambio clave aquí */}
                <img src={logo} alt="Logo" className="logo" />
            </NavLink>
            
            <nav className="nav">
                {!user && (
                    <NavLink to="/" className="nav-link" activeClassName="active" exact>
                        Inicio
                    </NavLink>
                )}
                
                <NavLink to="/juegos" className="nav-link" activeClassName="active">
                    Juegos
                </NavLink>
                <NavLink to="/contacto" className="nav-link" activeClassName="active">
                    Contacto
                </NavLink>
                <NavLink to="/recarga" className="nav-link" activeClassName="active">
                    Recarga
                </NavLink>
                
                {user ? (
                    <div className="user-section">
                        <FontAwesomeIcon icon={faUser} className="user-icon" />
                        <span className="welcome-text">Bienvenido, {user.username}</span>
                        <button onClick={handleLogout} className="logout-button">
                            Cerrar Sesión
                        </button>
                    </div>
                ) : (
                    <NavLink to="/login" className="nav-link" activeClassName="active">
                        Iniciar Sesión
                    </NavLink>
                )}
            </nav>
        </header>
    );
};

export default Header;