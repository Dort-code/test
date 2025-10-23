import React, { useState, useRef, useEffect } from 'react';
import { countries } from '../data/countries';
import './RegisterPage.css';

export function RegisterPage({ onRegister, onClose }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Россия по умолчанию
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [errors, setErrors] = useState({});

    const dropdownRef = useRef(null);

    // Закрытие dropdown при клике вне его
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowCountryDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePhoneChange = (e) => {
        // Разрешаем только цифры
        const value = e.target.value.replace(/\D/g, '');
        setFormData({
            ...formData,
            phone: value
        });
    };

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setShowCountryDropdown(false);
    };

    const validateForm = () => {
        const newErrors = {};

        if (formData.username.length < 3) {
            newErrors.username = 'Имя должно быть не менее 3 символов';
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (formData.phone.length < 10) {
            newErrors.phone = 'Введите корректный номер телефона';
        }

        if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const userData = {
                ...formData,
                country: selectedCountry,
                fullPhone: selectedCountry.dialCode + formData.phone
            };

            console.log('Регистрация:', userData);
            if (onRegister) {
                onRegister(userData);
            }
        }
    };

    const formatPhone = (phone) => {
        if (!phone) return '';
        // Форматирование номера для отображения
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
        if (!match) return phone;

        return [match[1], match[2], match[3], match[4]]
            .filter(Boolean)
            .join('-');
    };

    return (
        <div className="modal-overlay">
            <div className="register-modal">
                <div className="modal-header">
                    <h2>Регистрация</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="username">Имя пользователя</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Введите ваше имя"
                            className={errors.username ? 'error' : ''}
                        />
                        {errors.username && <span className="error-text">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Введите ваш email"
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Номер телефона</label>
                        <div className="phone-input-container">
                            <div
                                className="country-selector"
                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            >
                                <span className="country-flag">{selectedCountry.flag}</span>
                                <span className="country-code">{selectedCountry.dialCode}</span>
                                <span className="dropdown-arrow">▼</span>
                            </div>

                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formatPhone(formData.phone)}
                                onChange={handlePhoneChange}
                                required
                                placeholder="999-123-45-67"
                                className={`phone-input ${errors.phone ? 'error' : ''}`}
                            />
                        </div>

                        {showCountryDropdown && (
                            <div className="country-dropdown" ref={dropdownRef}>
                                {countries.map(country => (
                                    <div
                                        key={country.code}
                                        className="country-option"
                                        onClick={() => handleCountrySelect(country)}
                                    >
                                        <span className="country-flag">{country.flag}</span>
                                        <span className="country-name">{country.name}</span>
                                        <span className="country-dial-code">{country.dialCode}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Введите пароль"
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Подтвердите пароль</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Повторите пароль"
                            className={errors.confirmPassword ? 'error' : ''}
                        />
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                    </div>

                    <button type="submit" className="submit-btn">
                        Зарегистрироваться
                    </button>
                </form>

                <div className="modal-footer">
                    <p>Уже есть аккаунт? <button className="link-btn" onClick={onClose}>Войдите</button></p>
                </div>
            </div>
        </div>
    );
}