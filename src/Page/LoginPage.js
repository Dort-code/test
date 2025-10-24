import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь будет логика проверки логина/пароля
        console.log('Login data:', formData);
    };

    return (
        <div className="form-container">
            <div className="form-wrapper">
                <h2 className="form-title">Вход в систему</h2>
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
                        />
                    </div>

                    <button type="submit" className="submit-btn">
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;