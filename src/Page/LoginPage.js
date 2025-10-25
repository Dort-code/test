import React, { useState } from 'react';
import './LoginPage.css';

// Моковые данные пользователей для демонстрации
const mockUsers = [
    {
        login: 'manager',
        password: 'manager123',
        name: 'Менеджер Системы',
        role: 'manager'
    },
    {
        login: 'ivanov',
        password: 'ivanov123',
        name: 'Иванов Иван Иванович',
        role: 'chief'
    },
    {
        login: 'petrov',
        password: 'petrov123',
        name: 'Петров Петр Петрович',
        role: 'analyst'
    },
    {
        login: 'sidorova',
        password: 'sidorova123',
        name: 'Сидорова Мария Сергеевна',
        role: 'user'
    },
    {
        login: 'analyst',
        password: 'analyst123',
        name: 'Аналитик Анализ Анализович',
        role: 'analyst'
    },
    {
        login: 'kozlov',
        password: 'kozlov123',
        name: 'Козлов Алексей Владимирович',
        role: 'user'
    }
];

const LoginPage = ({ onLoginSuccess, onShowRegister }) => {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Очищаем ошибку при изменении полей
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Имитация задержки сети
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            // Проверка логина и пароля
            const user = mockUsers.find(u =>
                u.login === formData.login && u.password === formData.password
            );

            if (user) {
                console.log('Успешный вход:', user);
                // Передаем роль как есть из моковых данных
                onLoginSuccess({
                    login: user.login,
                    name: user.name,
                    role: user.role
                });
            } else {
                setError('Неверный логин или пароль');
            }
        } catch (err) {
            setError('Ошибка при входе в систему');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Обработчик для демонстрации быстрого входа (для тестирования)
    const handleQuickLogin = (userLogin) => {
        const user = mockUsers.find(u => u.login === userLogin);
        if (user) {
            setFormData({
                login: user.login,
                password: user.password
            });
        }
    };

    // Функция для отображения роли в кнопке быстрого входа
    const getRoleDisplayName = (role) => {
        const roleNames = {
            'manager': ' (Менеджер)',
            'chief': ' (Начальник)',
            'analyst': ' (Аналитик)',
            'user': ' (Пользователь)'
        };
        return roleNames[role] || '';
    };

    // Функция для получения класса кнопки по роли
    const getRoleButtonClass = (role) => {
        const roleClasses = {
            'manager': 'manager-user',
            'chief': 'chief-user',
            'analyst': 'analyst-user',
            'user': 'user-user'
        };
        return roleClasses[role] || '';
    };

    return (
        <div className="form-container">
            <div className="form-wrapper">
                <h2 className="form-title">Вход в систему</h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="login" className="form-label">
                            Логин или Email
                        </label>
                        <input
                            type="text"
                            id="login"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            className="form-input"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Пароль
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                {/* Блок для быстрого тестирования (можно удалить в продакшене) */}
                <div className="quick-login">
                    <h4>Быстрый вход для тестирования:</h4>
                    <div className="quick-login-buttons">
                        {mockUsers.map(user => (
                            <button
                                key={user.login}
                                type="button"
                                className={`quick-btn ${getRoleButtonClass(user.role)}`}
                                onClick={() => handleQuickLogin(user.login)}
                                disabled={isLoading}
                            >
                                {user.name}{getRoleDisplayName(user.role)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="login-links">
                    <button
                        type="button"
                        className="link-btn"
                        onClick={onShowRegister}
                    >
                        Нет аккаунта? Зарегистрироваться
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;