import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUsername } from '../../services/auth';
import api from '../../services/api';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import './perfil.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/api/auth/user');
                if (response.data) {
                    setUserData(response.data);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };
        fetchUserData();
    }, [navigate]);

    const validateUsername = (username) => /^[a-zA-Z0-9]{3,20}$/.test(username);

    const handleUpdateUsername = async () => {
        try {
            if (!validateUsername(newUsername)) {
                throw new Error('Nombre inválido (3-20 caracteres alfanuméricos)');
            }
            
            await updateUsername(newUsername);
            
            // Actualizar datos locales
            const updatedUser = { ...userData, username: newUsername };
            setUserData(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setIsEditing(false);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    if (!userData) return <div className="auth-loading">Cargando...</div>;

    return (
        <div className="auth-page">
            <Header />
            <main className="auth-main">
                <div className="auth-form-container">
                    <h2>Perfil de Usuario</h2>
                    {error && <div className="auth-error">{error}</div>}
                    
                    <div className="profile-info">
                        <div className="form-group">
                            <label>Nombre de usuario</label>
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        className="auth-input"
                                        placeholder="Nuevo nombre"
                                        autoFocus
                                    />
                                    <div className="profile-actions">
                                        <button
                                            className="auth-button"
                                            onClick={handleUpdateUsername}
                                            style={{ backgroundColor: '#28a745' }}
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            className="auth-button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setError('');
                                            }}
                                            style={{ backgroundColor: '#dc3545' }}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="auth-input profile-info-field">
                                        {userData.username}
                                    </div>
                                    <button
                                        className="auth-button"
                                        onClick={() => {
                                            setIsEditing(true);
                                            setNewUsername(userData.username);
                                        }}
                                        style={{ marginTop: '1rem' }}
                                    >
                                        Editar Nombre
                                    </button>
                                </>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <label>Email</label>
                            <div className="auth-input profile-info-field">
                                {userData.email}
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Estado de la cuenta</label>
                            <div className="auth-info-row">
                                <span className="auth-info-tag">
                                    Verificada: {userData.verified ? 'Sí' : 'No'}
                                </span>
                                <span className="auth-info-tag">
                                    MFA: {userData.mfaEnabled ? 'Activado' : 'Desactivado'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Miembro desde</label>
                            <div className="auth-input profile-info-field">
                                {new Date(userData.createdAt?.seconds * 1000).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                        
                        <button 
                            className="auth-button"
                            onClick={() => navigate(-1)}
                            style={{ marginTop: '2rem' }}
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;