import React, { useState } from 'react';
import LoginPage from './Page/LoginPage';
import RegisterPage from './Page/RegisterPage';
import UserDashboard from './Page/UserPA';
import logo from './lg.png';
import './App.css';

const App = () => {
    const [activeForm, setActiveForm] = useState('login');
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLoginSuccess = (userData) => {
        setCurrentUser(userData);
        setIsAuthenticated(true);
        setActiveForm('user');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setActiveForm('login');
    };

    const handleShowRegister = () => {
        setActiveForm('registration');
    };

    const handleBackToLogin = () => {
        setActiveForm('login');
    };

    // Если пользователь авторизован, показываем дашборд
    if (isAuthenticated && currentUser) {
        return (
            <div className="app">
                <header className="app-header">
                    <img src={logo} alt="Ростелеком" className="logo" />
                    <div className="header-user">
                        <span className="user-name">Добро пожаловать, {currentUser.name}</span>
                        <button onClick={handleLogout} className="logout-btn">
                            Выйти
                        </button>
                    </div>
                </header>
                <UserDashboard user={currentUser} />
            </div>
        );
    }

    // Если не авторизован, показываем формы входа/регистрации
    return (
        <div className="app">
            <header className="app-header">
                <img src={logo} alt="Ростелеком" className="logo" />
                <div className="header-buttons">
                    <button
                        className={`header-btn ${activeForm === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveForm('login')}
                    >
                        Вход
                    </button>
                    <button
                        className={`header-btn ${activeForm === 'registration' ? 'active' : ''}`}
                        onClick={() => setActiveForm('registration')}
                    >
                        Регистрация
                    </button>
                </div>
            </header>

            <main className="app-main">
                {activeForm === 'login' && (
                    <LoginPage
                        onLoginSuccess={handleLoginSuccess}
                        onShowRegister={handleShowRegister}
                    />
                )}
                {activeForm === 'registration' && (
                    <RegisterPage onBackToLogin={handleBackToLogin} />
                )}
            </main>
        </div>
    );
};

export default App;