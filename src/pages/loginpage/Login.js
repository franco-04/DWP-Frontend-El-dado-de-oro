import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, verifyMFA } from '../../services/auth';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('login');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ email, password });
            if (response.requiresMFA) {
                setStep('mfa');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const result = await verifyMFA({ email, token: otp });
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            navigate('/juegos');
        } catch (err) {
            setError(err.message.includes('Código') ? err.message : 'Error interno');
        }
    };

    return (
        <div className="auth-page">
            <Header />
            <main className="auth-main">
                <div className="auth-form-container">
                    {step === 'login' ? (
                        <>
                            <h2>Inicio de sesión</h2>
                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="auth-input"
                                        placeholder="Ej: jugador@casinodorado.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contraseña</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="auth-input"
                                        placeholder="Ingresa tu contraseña"
                                    />
                                </div>
                                {error && <div className="error-message">{error}</div>}
                                <button type="submit" className="auth-button">
                                    Ingresar
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2>Verificación en dos pasos</h2>
                            <form onSubmit={handleVerify}>
                                <div className="form-group">
                                    <label>Código de verificación</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="auth-input"
                                        placeholder="Ingresa el código de tu app"
                                    />
                                </div>
                                {error && <div className="error-message">{error}</div>}
                                <button type="submit" className="auth-button">
                                    Verificar
                                </button>
                            </form>
                        </>
                    )}
                    <p className="auth-link">
                        ¿No tienes cuenta? <a href="/registro">¡Regístrate!</a>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;