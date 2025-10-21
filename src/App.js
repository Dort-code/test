import logo from './logo.svg';
import './App.css';
import {LoginPage} from './Page/LoginPage';
import {UserPA} from './Page/UserPA';
import {AdminPA} from './Page/AdminPA';
import React, { useState } from 'react';
import lg from "./lg.png";

function App() {
    const [authInfo, setAuthInfo] = useState({
        isLoggedIn: false,
        role: null
    });
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleSuccessfulLogin = (role) => {
        setAuthInfo({
            isLoggedIn: true,
            role: role
        });
        setShowLoginModal(false);
    };

    const handleCloseModal = () => {
        setShowLoginModal(false);
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
                        <img src={lg} alt="lg" className="logo" />
                    </div>
                    <button
                        className="login-btn"
                        onClick={handleLoginClick}
                        aria-label="Вход"
                    >
                        <span className="login-text">Войти</span>
                    </button>
                </header>
            ) : authInfo.role === 'admin' ? (
                <AdminPA onLogout={handleLogout} />
            ) : (
                <UserPA onLogout={handleLogout} />
            )}

            {!authInfo.isLoggedIn && !showLoginModal && (
                <div className="welcome-message">
                    <h2>Добро пожаловать в систему ХЗ. Ваня Гей, но мы это опустим</h2>
                    <p>Пожалуйста, войдите в систему для доступа к функциям</p>
                </div>
            )}

            {showLoginModal && (
                <LoginPage
                    onLogin={handleSuccessfulLogin}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

export default App;
