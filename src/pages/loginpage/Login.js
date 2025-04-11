import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, verifyMFA, forgotPassword, resetPassword } from '../../services/auth';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('login'); // 'login', 'mfa'
    const [recoveryStep, setRecoveryStep] = useState(null); // null, 'email', 'code'
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSendingCode, setIsSendingCode] = useState(false); // Nuevo estado para controlar el envío
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
            
            // Limpiar todo el historial de navegación
            window.history.replaceState(null, null, '/juegos');
            navigate('/juegos', { replace: true });
            
            // Bloquear navegación futura
            window.history.pushState(null, null, window.location.href);
        } catch (err) {
            setError(err.message.includes('Código') ? err.message : 'Error interno');
        }
    };

    const handleRecoveryStart = (e) => {
        e.preventDefault();
        setRecoveryStep('email');
        setError('');
        setSuccessMessage('');
    };

    const handleRecoveryEmailSubmit = async (e) => {
        e.preventDefault();
        if (isSendingCode) return; // Evitar múltiples envíos
        
        setIsSendingCode(true);
        try {
            await forgotPassword(recoveryEmail);
            setRecoveryStep('code');
            setSuccessMessage('Código enviado a tu correo electrónico');
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSendingCode(false); // Restablecer estado
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(recoveryEmail, recoveryCode, newPassword);
            setSuccessMessage('Contraseña actualizada correctamente');
            setError('');
            setTimeout(() => {
                setRecoveryStep(null);
                setSuccessMessage('');
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    const cancelRecovery = () => {
        setRecoveryStep(null);
        setRecoveryEmail('');
        setRecoveryCode('');
        setNewPassword('');
        setError('');
        setSuccessMessage('');
    };

    return (
        <div className="auth-page">
            <Header />
            <main className="auth-main">
                <div className="auth-form-container">
                    {recoveryStep === 'email' && (
                        <>
                            <h2>Recuperar contraseña</h2>
                            <form onSubmit={handleRecoveryEmailSubmit}>
                                <div className="form-group">
                                    <label>Email registrado</label>
                                    <input
                                        type="email"
                                        value={recoveryEmail}
                                        onChange={(e) => setRecoveryEmail(e.target.value)}
                                        className="auth-input"
                                        placeholder="Ej: jugador@casinodorado.com"
                                        required
                                        disabled={isSendingCode}
                                    />
                                </div>
                                {error && <div className="error-message">{error}</div>}
                                {successMessage && <div className="success-message">{successMessage}</div>}
                                <div className="button-group">
                                    <button 
                                        type="submit" 
                                        className="auth-button"
                                        disabled={isSendingCode}
                                    >
                                        {isSendingCode ? 'Enviando...' : 'Enviar código'}
                                    </button>
                                    <button 
                                        type="button"
                                        className="auth-button secondary"
                                        onClick={cancelRecovery}
                                        disabled={isSendingCode}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {recoveryStep === 'code' && (
                        <>
                            <h2>Restablecer contraseña</h2>
                            <form onSubmit={handleResetPassword}>
                                <div className="form-group">
                                    <label>Código de verificación</label>
                                    <input
                                        type="text"
                                        value={recoveryCode}
                                        onChange={(e) => setRecoveryCode(e.target.value)}
                                        className="auth-input"
                                        placeholder="Código de 6 dígitos"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nueva contraseña</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="auth-input"
                                        placeholder="Mínimo 8 caracteres"
                                        required
                                    />
                                </div>
                                {error && <div className="error-message">{error}</div>}
                                {successMessage && <div className="success-message">{successMessage}</div>}
                                <div className="button-group">
                                    <button type="submit" className="auth-button">
                                        Actualizar contraseña
                                    </button>
                                    <button 
                                        type="button"
                                        className="auth-button secondary"
                                        onClick={() => setRecoveryStep('email')}
                                    >
                                        Volver
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {!recoveryStep && (
                        <>
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
                                <br />
                                <button 
                                    onClick={handleRecoveryStart} 
                                    className="link-button"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#007bff',
                                        cursor: 'pointer',
                                        padding: 0,
                                        marginTop: '10px',
                                        textDecoration: 'underline',
                                        font: 'inherit'
                                    }}
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;