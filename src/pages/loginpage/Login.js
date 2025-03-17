import React from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import './login.css'; // Asegúrate de que este CSS use las clases "auth-"

const Login = () => {
    return (
        <div className="auth-page"> {/* Cambiado a auth-page */}
            <Header />
            <main className="auth-main"> {/* Cambiado a auth-main */}
                
                {/* Contenedor del formulario */}
                <div className="auth-form-container">
                    <h2>Inicio de sesión</h2>
                    <form>
                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                placeholder="Ej: jugador@casinodorado.com"
                                className="auth-input" // Clase añadida
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input 
                                type="password" 
                                placeholder="Ingresa tu contraseña"
                                className="auth-input" // Clase añadida
                            />
                        </div>
                        <button type="submit" className="auth-button"> {/* Clase cambiada */}
                            Ingresar
                        </button>
                    </form>
                    <p className="auth-link"> {/* Clase cambiada */}
                        ¿Aún no tienes una cuenta? <a href="/registro">¡Regístrate!</a>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;