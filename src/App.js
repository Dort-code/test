import logo from './logo.svg';
import './App.css';
import { LoginPage } from './Page/LoginPage';
import { UserPA } from './Page/UserPA';
import { AdminPA } from './Page/AdminPA';
import { RegisterPage } from './Page/RegisterPage';
import React, { useState } from 'react';
import lg from "./lg.png";

function App() {
    const [authInfo, setAuthInfo] = useState({
        isLoggedIn: false,
        role: null
    });
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleRegisterClick = () => {
        setShowRegisterModal(true);
    };

    const handleSuccessfulLogin = (role) => {
        setAuthInfo({
            isLoggedIn: true,
            role: role
        });
        setShowLoginModal(false);
    };

    const handleSuccessfulRegister = (userData) => {
        console.log('Пользователь зарегистрирован:', userData);
        alert('Регистрация успешна! Теперь вы можете войти в систему.');
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    const handleCloseModal = () => {
        setShowLoginModal(false);
    };

    const handleCloseRegisterModal = () => {
        setShowRegisterModal(false);
    };

    const handleLogout = () => {
        setAuthInfo({
            isLoggedIn: false,
            role: null
        });
    };

    return (
        <div className="app-container">
            {!authInfo.isLoggedIn ? (
                <header className="header">
                    <div className="logo-container">
                        <img src={lg} alt="Логотип" className="logo" />
                    </div>
                    <div className="auth-buttons">
                        <button
                            className="register-btn"
                            onClick={handleRegisterClick}
                            aria-label="Регистрация"
                        >
                            <span className="register-text">Регистрация</span>
                        </button>
                        <button
                            className="login-btn"
                            onClick={handleLoginClick}
                            aria-label="Вход"
                        >
                            <span className="login-text">Войти</span>
                        </button>
                    </div>
                </header>
            ) : authInfo.role === 'admin' ? (
                <AdminPA onLogout={handleLogout} />
            ) : (
                <UserPA onLogout={handleLogout} />
            )}

            {!authInfo.isLoggedIn && !showLoginModal && !showRegisterModal && (
                <div className="welcome-message">
                    <h2>Молодцы, путники вы добрались до этого шага</h2>
                    <p>Пожалуйста, войдите в систему для доступа к функциям</p>
                </div>
            )}

            {showLoginModal && (
                <LoginPage
                    onLogin={handleSuccessfulLogin}
                    onClose={handleCloseModal}
                />
            )}

            {showRegisterModal && (
                <RegisterPage
                    onRegister={handleSuccessfulRegister}
                    onClose={handleCloseRegisterModal}
                />
            )}
        </div>
    );
}

export default App;