import React from 'react';
import { NavLink } from 'react-router-dom';
import './style/Header.css';
import logo from '../../images/Logo.png'; // Importa la imagen del logo

const Header = () => {
    return (
        <header className="header">
            {/* Aquí agregamos el logo */}
            <img src={logo} alt="Logo" className="logo" />
            <nav className="nav">
                <NavLink to="/" className="nav-link" activeClassName="active" exact>Inicio</NavLink>
                <NavLink to="/juegos" className="nav-link" activeClassName="active">Juegos</NavLink>
                <NavLink to="/contacto" className="nav-link" activeClassName="active">Contacto</NavLink>
                <NavLink to="/recarga" className="nav-link" activeClassName="active">Recarga</NavLink>
            </nav>
        </header>
    );
};

export default Header;