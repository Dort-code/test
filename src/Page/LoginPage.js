import React, { useState } from 'react';

export function LoginPage({ onLogin, onClose }) {
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
        // Очищаем ошибку при изменении поля
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loginData.username || !loginData.password) {
            setError('Заполните все поля');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Имитация запроса к серверу
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Простая логика авторизации
            let role = 'user';
            if (loginData.username.toLowerCase() === 'admin') {
                role = 'admin';
            }

            // Вызываем колбэк с ролью пользователя
            onLogin(role);

        } catch (err) {
            setError('Ошибка при входе в систему');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div
            className="modal-overlay"
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
        >
            <div className="login-window">
                <div className="modal-header">
                    <h2 id="login-title">Вход в систему</h2>
                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                        aria-label="Закрыть окно входа"
                        disabled={isLoading}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="login-username">Имя пользователя</label>
                        <input
                            type="text"
                            id="login-username"
                            name="username"
                            value={loginData.username}
                            onChange={handleChange}
                            required
                            placeholder="Введите имя пользователя"
                            disabled={isLoading}
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="login-password">Пароль</label>
                        <input
                            type="password"
                            id="login-password"
                            name="password"
                            value={loginData.password}
                            onChange={handleChange}
                            required
                            placeholder="Введите пароль"
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className="form-error">
                            <span className="error-text">{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading-spinner" aria-hidden="true"></span>
                                Вход...
                            </>
                        ) : (
                            'Войти в систему'
                        )}
                    </button>
                </form>

                <div className="modal-footer">
                    <p>
                        Нет аккаунта?{' '}
                        <button
                            type="button"
                            className="link-btn"
                            onClick={onClose}
                        >
                            Зарегистрируйтесь
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}