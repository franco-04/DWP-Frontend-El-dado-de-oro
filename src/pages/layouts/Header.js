import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./style/Header.css";
import logo from "../../images/Logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCoins } from "@fortawesome/free-solid-svg-icons";
import { getUserFichas } from '../../services/payments';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [tokenCount, setTokenCount] = useState(user?.fichas || 0);

  // Fetch latest token count from API
  useEffect(() => {
    const fetchTokens = async () => {
      if (user && localStorage.getItem('token')) {
        try {
          const result = await getUserFichas();
          setTokenCount(result?.data?.fichas || 0); // Usar optional chaining
          
          const updatedUser = {...user, fichas: result?.data?.fichas || 0};
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (err) {
          console.error("Error fetching tokens:", err);
        }
      }
    };

    fetchTokens();
    
    // Set up a refresh interval (every 30 seconds)
    const intervalId = setInterval(fetchTokens, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [user]);

  // Escuchar el evento de actualización de fichas
  useEffect(() => {
    const handleFichasUpdated = async () => {
      if (user && localStorage.getItem('token')) {
        try {
          const result = await getUserFichas();
          setTokenCount(result?.data?.fichas || 0);
          
          const updatedUser = {...user, fichas: result?.data?.fichas || 0};
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (err) {
          console.error("Error updating tokens:", err);
        }
      }
    };

    window.addEventListener('fichasUpdated', handleFichasUpdated);
    
    return () => {
      window.removeEventListener('fichasUpdated', handleFichasUpdated);
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
    window.location.reload(); // Forzar recarga completa
  };

  return (
    <header className="header">
      <NavLink to={user ? "/juegos" : "/"} exact>
        {" "}
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
        <NavLink to="/productos" className="nav-link" activeClassName="active">
          Productos
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
            <NavLink to="/perfil" className="welcome-text">
              Bienvenido, {user.username}
            </NavLink>
            <div className="user-tokens">
              <FontAwesomeIcon icon={faCoins} className="token-icon" />
              <span className="token-count">{tokenCount}</span>
            </div>
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