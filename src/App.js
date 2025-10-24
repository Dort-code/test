import React, { useState } from 'react';
import LoginPage from './Page/LoginPage';
import RegistrationPage from './Page/RegisterPage';
import logo from './lg.png';
import './App.css';

const App = () => {
    const [activeForm, setActiveForm] = useState('login');

    const handleLoginClick = () => {
        setActiveForm('login');
    };

    const handleRegisterClick = () => {
        setActiveForm('registration');
    };

    return (
        <div className="app">
            <header className="app-header">
                <img src={logo} alt="Ростелеком" className="logo" />
                <div className="header-buttons">
                    <button
                        className={`header-btn ${activeForm === 'login' ? 'active' : ''}`}
                        onClick={handleLoginClick}
                    >
                        Вход
                    </button>
                    <button
                        className={`header-btn ${activeForm === 'registration' ? 'active' : ''}`}
                        onClick={handleRegisterClick}
                    >
                        Регистрация
                    </button>
                </div>
            </header>

            <main className="app-main">
                {activeForm === 'login' && <LoginPage />}
                {activeForm === 'registration' && <RegistrationPage />}
            </main>
        </div>
    );
};

export default App;