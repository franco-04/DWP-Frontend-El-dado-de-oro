import React from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import './login.css'; // Importa el archivo CSS

const Login = () => {
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
                        Don't have an account? <a href="/registro">Sign up</a>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
