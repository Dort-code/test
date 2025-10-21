import logo from './logo.svg';
import './App.css';
import {LoginPage} from './Page/LoginPage';
import {UserPA} from './Page/UserPA';
import {AdminPA} from './Page/AdminPA';
import React, { useState } from 'react';

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
                    <h2>Добро пожаловать в систему ХЪ</h2>
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
