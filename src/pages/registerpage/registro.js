import React from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import './registro.css'; // Importa el archivo CSS

const Registro = () => {
    return (
        <div className="login-page">
            <Header />
            <main className="login-main">
                {/* Texto en la parte superior, alineado a la izquierda */}
                <div className="login-top-text">
                    <h1>Bienvenido a Mi Sitio</h1>
                    <p>Ingresa tus datos para acceder</p>
                </div>
                {/* Contenedor blanco con el formulario */}
                <div className="login-form-container">
                    <h2>Login</h2>
                    <form>
                    <div className="form-group">
                            <label>User Name</label>
                            <input type="UserName" placeholder="Enter your User Name" />
                        </div>
                        <div className="form-group">
                            <label>Email address</label>
                            <input type="email" placeholder="Enter your email" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="Enter your password" />
                        </div>
                        <button type="submit" className="login-button">Login</button>
                    </form>
                    <p className="signup-link">
                        ¿Ya tienes cuenta? <a href="/login">Sign up</a>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Registro;
