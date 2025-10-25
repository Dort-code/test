import React, { useState } from 'react';
import LoginPage from './Page/LoginPage';
import RegisterPage from './Page/RegisterPage';
import UserDashboard from './Page/UserPA';
import AnaliticDashboard from './Page/AnaliticDashboard';
import ChiefDashboard from './Page/ChiefDashboard';
import ManagerDashboard from "./Page/ManagerDashboard";
import logo from './lg.png';
import './App.css';

const App = () => {
    const [activeForm, setActiveForm] = useState('login');
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLoginSuccess = (userData) => {
        setCurrentUser(userData);
        setIsAuthenticated(true);

        // Определяем какой дашборд показывать в зависимости от роли
        if (userData.role === 'manager' || userData.role === 'chief') {
            setActiveForm('chief');
        } else if (userData.role === 'analyst') {
            setActiveForm('analyst');
        } else {
            setActiveForm('user');
        }
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

    // Функция для рендеринга правильного дашборда
    const renderDashboard = () => {
        switch (currentUser.role) {
            case 'manager':
                return <ManagerDashboard user={currentUser} />;
            case 'chief':
                return <ChiefDashboard user={currentUser} />;
            case 'analyst':
                return <AnaliticDashboard user={currentUser} />;
            default:
                return <UserDashboard user={currentUser} />;
        }
    };

    // Получение отображаемого имени роли
    const getRoleDisplayName = (role) => {
        const roleNames = {
            'manager': 'Менеджер',
            'chief': 'Начальник отдела',
            'analyst': 'Аналитик',
            'user': 'Пользователь'
        };
        return roleNames[role] || role;
    };

    // Если пользователь авторизован, показываем соответствующий дашборд
    if (isAuthenticated && currentUser) {
        return (
            <div className="app">
                <header className="app-header">
                    <img src={logo} alt="Ростелеком" className="logo" />
                    <div className="header-user">
                        <span className="user-name">
                            Добро пожаловать, {currentUser.name}
                            <span className="role-badge" data-role={currentUser.role}>
                                {getRoleDisplayName(currentUser.role)}
                            </span>
                        </span>
                        <button onClick={handleLogout} className="logout-btn">
                            Выйти
                        </button>
                    </div>
                </header>
                {renderDashboard()}
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