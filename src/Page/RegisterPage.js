import React, { useState, useRef, useEffect } from 'react';
import { countries } from '../countries';

export function RegisterPage({ onRegister, onClose }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dropdownRef = useRef(null);
    const modalRef = useRef(null);

    // Закрытие dropdown при клике вне его
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowCountryDropdown(false);
            }

            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Блокировка скролла body при открытом модальном окне
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 15);
        setFormData(prev => ({
            ...prev,
            phone: value
        }));

        if (errors.phone) {
            setErrors(prev => ({
                ...prev,
                phone: ''
            }));
        }
    };

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setShowCountryDropdown(false);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Имя пользователя обязательно';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Имя должно быть не менее 3 символов';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Номер телефона обязателен';
        } else if (formData.phone.length < 10) {
            newErrors.phone = 'Номер телефона должен содержать не менее 10 цифр';
        }

        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Подтвердите пароль';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm() || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const userData = {
                ...formData,
                country: selectedCountry,
                fullPhone: selectedCountry.dialCode + formData.phone
            };

            console.log('Регистрация пользователя:', userData);

            if (onRegister) {
                onRegister(userData);
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            setErrors({ submit: 'Произошла ошибка при регистрации. Попробуйте еще раз.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatPhoneDisplay = (phone) => {
        if (!phone) return '';

        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length <= 3) return cleaned;
        if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
        if (cleaned.length <= 8) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;

        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`;
    };

    const toggleCountryDropdown = () => {
        setShowCountryDropdown(prev => !prev);
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
            aria-labelledby="register-title"
        >
            <div
                className="register-window"
                ref={modalRef}
            >
                <div className="modal-header">
                    <h2 id="register-title">Создать аккаунт</h2>
                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                        aria-label="Закрыть окно регистрации"
                        disabled={isSubmitting}
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="register-form"
                    noValidate
                >
                    <div className="form-group">
                        <label htmlFor="username">
                            Имя пользователя
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Придумайте имя пользователя"
                            className={errors.username ? 'error' : ''}
                            aria-describedby={errors.username ? 'username-error' : undefined}
                            disabled={isSubmitting}
                        />
                        {errors.username && (
                            <span id="username-error" className="error-text">
                                {errors.username}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            Электронная почта
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                            className={errors.email ? 'error' : ''}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                            disabled={isSubmitting}
                        />
                        {errors.email && (
                            <span id="email-error" className="error-text">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">
                            Номер телефона
                        </label>
                        <div className="phone-input-container">
                            <div
                                className="country-selector"
                                onClick={toggleCountryDropdown}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        toggleCountryDropdown();
                                    }
                                }}
                                aria-haspopup="listbox"
                                aria-expanded={showCountryDropdown}
                                aria-label={`Выбрана страна: ${selectedCountry.name}, код: ${selectedCountry.dialCode}`}
                                disabled={isSubmitting}
                            >
                                <span className="country-flag" aria-hidden="true">
                                    {selectedCountry.flag}
                                </span>
                                <span className="country-code">
                                    {selectedCountry.dialCode}
                                </span>
                                <span
                                    className="dropdown-arrow"
                                    aria-hidden="true"
                                    style={{
                                        transform: showCountryDropdown ? 'rotate(180deg)' : 'none'
                                    }}
                                >
                                    ▼
                                </span>
                            </div>

                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formatPhoneDisplay(formData.phone)}
                                onChange={handlePhoneChange}
                                required
                                placeholder="999-123-45-67"
                                className={`phone-input ${errors.phone ? 'error' : ''}`}
                                aria-describedby={errors.phone ? 'phone-error' : undefined}
                                disabled={isSubmitting}
                            />
                        </div>

                        {showCountryDropdown && (
                            <div
                                className="country-dropdown"
                                ref={dropdownRef}
                                role="listbox"
                                aria-label="Выбор страны"
                            >
                                {countries.map(country => (
                                    <div
                                        key={country.code}
                                        className="country-option"
                                        onClick={() => handleCountrySelect(country)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleCountrySelect(country);
                                            }
                                        }}
                                        role="option"
                                        aria-selected={selectedCountry.code === country.code}
                                        tabIndex={0}
                                    >
                <span className="country-flag-option" aria-hidden="true">
                    {country.flag}
                </span>
                                        <span className="country-name">
                    {country.name}
                </span>
                                        <span className="country-dial-code">
                    {country.dialCode}
                </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {errors.phone && (
                            <span id="phone-error" className="error-text">
                                {errors.phone}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Пароль
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Не менее 6 символов"
                            className={errors.password ? 'error' : ''}
                            aria-describedby={errors.password ? 'password-error' : undefined}
                            disabled={isSubmitting}
                        />
                        {errors.password && (
                            <span id="password-error" className="error-text">
                                {errors.password}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            Подтверждение пароля
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Повторите ваш пароль"
                            className={errors.confirmPassword ? 'error' : ''}
                            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                            disabled={isSubmitting}
                        />
                        {errors.confirmPassword && (
                            <span id="confirmPassword-error" className="error-text">
                                {errors.confirmPassword}
                            </span>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="form-error">
                            <span className="error-text">{errors.submit}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading-spinner" aria-hidden="true"></span>
                                Регистрация...
                            </>
                        ) : (
                            'Создать аккаунт'
                        )}
                    </button>
                </form>

                <div className="modal-footer">
                    <p>
                        Уже есть аккаунт?{' '}
                        <button
                            type="button"
                            className="link-btn"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Войти в систему
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}