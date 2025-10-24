import React, { useState } from 'react';
import './LoginPage.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        Name: '',
        phone: '',
        department: '',
        login: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const departments = [
        'Отдел IT',
        'Отдел продаж',
        'Бухгалтерия',
        'Отдел кадров',
        'Техническая поддержка',
        'Администрация'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Валидация ФИО (исправлено с lastName на Name)
        if (!formData.Name.trim()) {
            newErrors.Name = 'ФИО обязательно';
        }

        // Валидация телефона
        if (!formData.phone.trim()) {
            newErrors.phone = 'Телефон обязателен';
        } else if (!/^(\+7|8)[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Введите корректный номер телефона';
        }

        // Валидация отдела
        if (!formData.department) {
            newErrors.department = 'Выберите отдел';
        }

        // Валидация логина/email
        if (!formData.login.trim()) {
            newErrors.login = 'Логин обязателен';
        } else if (formData.login.length < 3) {
            newErrors.login = 'Логин должен содержать минимум 3 символа';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }

        // Валидация паролей
        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Подтверждение пароля обязательно';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        const numbers = value.replace(/\D/g, '');

        let formattedValue = value;
        if (numbers.length <= 1) {
            formattedValue = numbers ? '+7' : '';
        } else if (numbers.length <= 4) {
            formattedValue = `+7 (${numbers.slice(1, 4)}`;
        } else if (numbers.length <= 7) {
            formattedValue = `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}`;
        } else if (numbers.length <= 9) {
            formattedValue = `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}`;
        } else {
            formattedValue = `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
        }

        setFormData({
            ...formData,
            phone: formattedValue
        });

        if (errors.phone) {
            setErrors({
                ...errors,
                phone: ''
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Логика успешной регистрации
            const submitData = {
                ...formData,
                phone: formData.phone.replace(/\D/g, '') // Сохраняем только цифры
            };
            console.log('Registration data:', submitData);
            alert('Регистрация успешна!');
        }
    };

    return (
        <div className="form-container">
            <div className="form-wrapper registration-wrapper">
                <h2 className="form-title">Регистрация</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    {/* ФИО поле */}
                    <div className="form-group">
                        <label htmlFor="Name" className="form-label">
                            ФИО *
                        </label>
                        <input
                            type="text"
                            id="Name"
                            name="Name"
                            value={formData.Name}
                            onChange={handleChange}
                            className={`form-input ${errors.Name ? 'error' : ''}`}
                            required
                        />
                        {errors.Name && <span className="error-message">{errors.Name}</span>}
                    </div>

                    {/* Телефон и отдел */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">
                                Телефон *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                placeholder="+7 (999) 123-45-67"
                                className={`form-input ${errors.phone ? 'error' : ''}`}
                                required
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="department" className="form-label">
                                Отдел *
                            </label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className={`form-input ${errors.department ? 'error' : ''}`}
                                required
                            >
                                <option value="">Выберите отдел</option>
                                {departments.map((dept, index) => (
                                    <option key={index} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                            {errors.department && <span className="error-message">{errors.department}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="login" className="form-label">
                                Логин *
                            </label>
                            <input
                                type="text"
                                id="login"
                                name="login"
                                value={formData.login}
                                onChange={handleChange}
                                className={`form-input ${errors.login ? 'error' : ''}`}
                                required
                            />
                            {errors.login && <span className="error-message">{errors.login}</span>}
                        </div>
                    </div>

                    {/* Логин и email */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                required
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Пароль *
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                required
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Подтверждение пароля *
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                required
                            />
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;