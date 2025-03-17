import React from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import './registro.css'; // Usar el mismo CSS para ambas páginas

const Registro = () => {
    return (
        <div className="auth-page">
            <Header />
            <main className="auth-main">
                
                {/* Contenedor del formulario estilo casino */}
                <div className="auth-form-container">
                    <h2>Registro</h2>
                    <form>
                        <div className="form-group">
                            <label>Nombre de usuario</label>
                            <input 
                                type="text" 
                                placeholder="Ej: JugadorMaster"
                                className="auth-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                placeholder="Ej: contacto@casinodorado.com"
                                className="auth-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input 
                                type="password" 
                                placeholder="Crea tu contraseña"
                                className="auth-input"
                            />
                        </div>
                        <button type="submit" className="auth-button">
                            Crear Cuenta
                        </button>
                    </form>
                    <p className="auth-link">
                        ¿Ya tienes cuenta? <a href="/login">¡Inicia sesión!</a>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Registro;