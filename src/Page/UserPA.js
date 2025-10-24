import React, { useState, useEffect } from 'react';
import './UserPA.css';

const UserPA = () => {
    const [activeTab, setActiveTab] = useState('search');
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [searchInn, setSearchInn] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Списки для выпадающих полей
    const services = ['ИТ-консалтинг', 'Разработка ПО', 'Техническая поддержка', 'Облачные решения', 'Кибербезопасность'];
    const paymentTypes = ['Аванс', 'Поэтапная', 'По завершении', 'Ежемесячная'];
    const projectStages = ['Инициация', 'Планирование', 'Исполнение', 'Контроль', 'Завершение'];
    const businessSegments = ['Корпоративный', 'Государственный', 'Малый бизнес', 'Средний бизнес'];
    const forecastAcceptance = ['Высокий', 'Средний', 'Низкий', 'Под вопросом'];
    const revenueStatuses = ['Планируется', 'Начислена', 'Отложена', 'Отменена'];
    const costTypes = ['Зарплата', 'Оборудование', 'Лицензии', 'Командировки', 'Прочие'];
    const costStatuses = ['Планируются', 'Учтены', 'Отложены', 'Списаны'];

    // Вероятность реализации по этапам
    const stageProbabilities = {
        'Инициация': 10,
        'Планирование': 30,
        'Исполнение': 60,
        'Контроль': 80,
        'Завершение': 100
    };

    const [formData, setFormData] = useState({
        // Общая информация
        organizationName: '',
        organizationInn: '',
        projectName: '',
        service: '',
        paymentType: '',
        projectStage: '',
        implementationProbability: 0,
        manager: '',
        businessSegment: '',
        implementationYear: '',
        isIndustrySolution: false,
        isForecastAccepted: false,
        isDzoImplementation: false,
        needsManagementControl: false,
        forecastAcceptanceLevel: '',
        industryManager: '',
        projectNumber: '',
        projectCreationDate: new Date().toISOString().split('T')[0],

        // Выручка
        revenue: [{ year: '', month: '', amount: '', status: '' }],

        // Затраты
        costs: [{ year: '', month: '', amount: '', costType: '', status: '' }],

        // Дополнительная информация
        currentStatus: '',
        periodAchievements: '',
        nextPeriodPlans: '',
        comments: []
    });

    // Поиск проекта по ИНН
    const handleSearch = () => {
        const results = projects.filter(project =>
            project.organizationInn.includes(searchInn)
        );
        setSearchResults(results);
    };

    // Загрузка проекта для редактирования
    const loadProject = (project) => {
        setCurrentProject(project);
        setFormData(project);
        setActiveTab('edit');
    };

    // Создание нового проекта
    const createNewProject = () => {
        setCurrentProject(null);
        setFormData({
            organizationName: '',
            organizationInn: '',
            projectName: '',
            service: '',
            paymentType: '',
            projectStage: '',
            implementationProbability: 0,
            manager: '',
            businessSegment: '',
            implementationYear: '',
            isIndustrySolution: false,
            isForecastAccepted: false,
            isDzoImplementation: false,
            needsManagementControl: false,
            forecastAcceptanceLevel: '',
            industryManager: '',
            projectNumber: '',
            projectCreationDate: new Date().toISOString().split('T')[0],
            revenue: [{ year: '', month: '', amount: '', status: '' }],
            costs: [{ year: '', month: '', amount: '', costType: '', status: '' }],
            currentStatus: '',
            periodAchievements: '',
            nextPeriodPlans: '',
            comments: []
        });
        setActiveTab('edit');
    };

    // Обработчик изменений формы
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Автоматическое обновление вероятности при изменении этапа
        if (name === 'projectStage') {
            setFormData(prev => ({
                ...prev,
                implementationProbability: stageProbabilities[value] || 0
            }));
        }
    };

    // Добавление записи выручки
    const addRevenueRecord = () => {
        setFormData(prev => ({
            ...prev,
            revenue: [...prev.revenue, { year: '', month: '', amount: '', status: '' }]
        }));
    };

    // Удаление записи выручки
    const removeRevenueRecord = (index) => {
        setFormData(prev => ({
            ...prev,
            revenue: prev.revenue.filter((_, i) => i !== index)
        }));
    };

    // Изменение записи выручки
    const handleRevenueChange = (index, field, value) => {
        const updatedRevenue = [...formData.revenue];
        updatedRevenue[index][field] = value;
        setFormData(prev => ({ ...prev, revenue: updatedRevenue }));
    };

    // Аналогичные функции для затрат
    const addCostRecord = () => {
        setFormData(prev => ({
            ...prev,
            costs: [...prev.costs, { year: '', month: '', amount: '', costType: '', status: '' }]
        }));
    };

    const removeCostRecord = (index) => {
        setFormData(prev => ({
            ...prev,
            costs: prev.costs.filter((_, i) => i !== index)
        }));
    };

    const handleCostChange = (index, field, value) => {
        const updatedCosts = [...formData.costs];
        updatedCosts[index][field] = value;
        setFormData(prev => ({ ...prev, costs: updatedCosts }));
    };

    // Сохранение проекта
    const saveProject = () => {
        const projectToSave = {
            ...formData,
            lastModified: new Date().toISOString(),
            comments: [
                `Изменение от ${new Date().toLocaleString()}`,
                ...formData.comments.slice(0, 9)
            ]
        };

        if (currentProject) {
            // Обновление существующего проекта
            setProjects(prev => prev.map(p =>
                p.id === currentProject.id ? projectToSave : p
            ));
        } else {
            // Создание нового проекта
            const newProject = {
                ...projectToSave,
                id: Date.now().toString()
            };
            setProjects(prev => [...prev, newProject]);
        }

        alert('Проект сохранен!');
        setActiveTab('search');
    };

    // Удаление проекта
    const deleteProject = () => {
        if (currentProject) {
            setProjects(prev => prev.filter(p => p.id !== currentProject.id));
            setActiveTab('search');
            alert('Проект удален!');
        }
    };

    return (
        <div className="user-dashboard">
            <header className="dashboard-header">
                <h1>Система управления проектами</h1>
                <div className="user-info">
                    <span>Пользователь: Иванов И.И.</span>
                </div>
            </header>

            <nav className="dashboard-nav">
                <button
                    className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}
                    onClick={() => setActiveTab('search')}
                >
                    Поиск проектов
                </button>
                <button
                    className={`nav-btn ${activeTab === 'edit' ? 'active' : ''}`}
                    onClick={createNewProject}
                >
                    Создать проект
                </button>
            </nav>

            <main className="dashboard-main">
                {activeTab === 'search' && (
                    <div className="search-tab">
                        <div className="search-section">
                            <h2>Поиск проекта по ИНН</h2>
                            <div className="search-controls">
                                <input
                                    type="text"
                                    placeholder="Введите ИНН организации"
                                    value={searchInn}
                                    onChange={(e) => setSearchInn(e.target.value)}
                                    className="search-input"
                                />
                                <button onClick={handleSearch} className="search-btn">
                                    Найти
                                </button>
                            </div>

                            {searchResults.length > 0 && (
                                <div className="search-results">
                                    <h3>Найденные проекты:</h3>
                                    {searchResults.map(project => (
                                        <div key={project.id} className="project-card">
                                            <div className="project-info">
                                                <strong>{project.organizationName}</strong>
                                                <span>ИНН: {project.organizationInn}</span>
                                                <span>Проект: {project.projectName}</span>
                                            </div>
                                            <button
                                                onClick={() => loadProject(project)}
                                                className="edit-btn"
                                            >
                                                Редактировать
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'edit' && (
                    <div className="edit-tab">
                        <div className="form-section">
                            <h2>{currentProject ? 'Редактирование проекта' : 'Создание нового проекта'}</h2>

                            {/* Общая информация */}
                            <div className="form-group">
                                <h3>Общая информация по проекту</h3>
                                <div className="form-row">
                                    <div className="form-field">
                                        <label>Название организации *</label>
                                        <input
                                            type="text"
                                            name="organizationName"
                                            value={formData.organizationName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>ИНН организации *</label>
                                        <input
                                            type="text"
                                            name="organizationInn"
                                            value={formData.organizationInn}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-field">
                                        <label>Название проекта *</label>
                                        <input
                                            type="text"
                                            name="projectName"
                                            value={formData.projectName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Услуга *</label>
                                        <select
                                            name="service"
                                            value={formData.service}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Выберите услугу</option>
                                            {services.map(service => (
                                                <option key={service} value={service}>{service}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-field">
                                        <label>Тип платежа</label>
                                        <select
                                            name="paymentType"
                                            value={formData.paymentType}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Выберите тип</option>
                                            {paymentTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-field">
                                        <label>Этап проекта</label>
                                        <select
                                            name="projectStage"
                                            value={formData.projectStage}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Выберите этап</option>
                                            {projectStages.map(stage => (
                                                <option key={stage} value={stage}>{stage}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-field">
                                        <label>Вероятность реализации</label>
                                        <input
                                            type="text"
                                            value={`${formData.implementationProbability}%`}
                                            disabled
                                            className="disabled-field"
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Менеджер</label>
                                        <input
                                            type="text"
                                            name="manager"
                                            value={formData.manager}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-field">
                                        <label>Сегмент бизнеса</label>
                                        <select
                                            name="businessSegment"
                                            value={formData.businessSegment}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Выберите сегмент</option>
                                            {businessSegments.map(segment => (
                                                <option key={segment} value={segment}>{segment}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-field">
                                        <label>Год реализации</label>
                                        <input
                                            type="number"
                                            name="implementationYear"
                                            value={formData.implementationYear}
                                            onChange={handleInputChange}
                                            min="2020"
                                            max="2030"
                                        />
                                    </div>
                                </div>

                                <div className="checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="isIndustrySolution"
                                            checked={formData.isIndustrySolution}
                                            onChange={handleInputChange}
                                        />
                                        Отраслевое решение
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="isForecastAccepted"
                                            checked={formData.isForecastAccepted}
                                            onChange={handleInputChange}
                                        />
                                        Принимаемый к прогнозу
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="isDzoImplementation"
                                            checked={formData.isDzoImplementation}
                                            onChange={handleInputChange}
                                        />
                                        Реализация через ДЗО
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="needsManagementControl"
                                            checked={formData.needsManagementControl}
                                            onChange={handleInputChange}
                                        />
                                        Требуется контроль статуса на уровне руководства
                                    </label>
                                </div>

                                {formData.isForecastAccepted && (
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Принимаемый к оценке</label>
                                            <select
                                                name="forecastAcceptanceLevel"
                                                value={formData.forecastAcceptanceLevel}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Выберите оценку</option>
                                                {forecastAcceptance.map(level => (
                                                    <option key={level} value={level}>{level}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {formData.isIndustrySolution && (
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Отраслевой менеджер</label>
                                            <input
                                                type="text"
                                                name="industryManager"
                                                value={formData.industryManager}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Номер проекта</label>
                                            <input
                                                type="text"
                                                name="projectNumber"
                                                value={formData.projectNumber}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="form-row">
                                    <div className="form-field">
                                        <label>Дата создания проекта</label>
                                        <input
                                            type="date"
                                            value={formData.projectCreationDate}
                                            disabled
                                            className="disabled-field"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Информация по выручке */}
                            <div className="form-group">
                                <h3>Информация по выручке проекта</h3>
                                {formData.revenue.map((record, index) => (
                                    <div key={index} className="revenue-record">
                                        <div className="form-row">
                                            <div className="form-field">
                                                <label>Год</label>
                                                <input
                                                    type="number"
                                                    value={record.year}
                                                    onChange={(e) => handleRevenueChange(index, 'year', e.target.value)}
                                                    min="2020"
                                                    max="2030"
                                                />
                                            </div>
                                            <div className="form-field">
                                                <label>Месяц</label>
                                                <input
                                                    type="number"
                                                    value={record.month}
                                                    onChange={(e) => handleRevenueChange(index, 'month', e.target.value)}
                                                    min="1"
                                                    max="12"
                                                />
                                            </div>
                                            <div className="form-field">
                                                <label>Сумма</label>
                                                <input
                                                    type="number"
                                                    value={record.amount}
                                                    onChange={(e) => handleRevenueChange(index, 'amount', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <label>Статус начисления</label>
                                                <select
                                                    value={record.status}
                                                    onChange={(e) => handleRevenueChange(index, 'status', e.target.value)}
                                                >
                                                    <option value="">Выберите статус</option>
                                                    {revenueStatuses.map(status => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {formData.revenue.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeRevenueRecord(index)}
                                                    className="remove-btn"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addRevenueRecord} className="add-btn">
                                    + Добавить запись выручки
                                </button>
                            </div>

                            {/* Информация по затратам */}
                            <div className="form-group">
                                <h3>Информация по затратам проекта</h3>
                                {formData.costs.map((record, index) => (
                                    <div key={index} className="cost-record">
                                        <div className="form-row">
                                            <div className="form-field">
                                                <label>Год</label>
                                                <input
                                                    type="number"
                                                    value={record.year}
                                                    onChange={(e) => handleCostChange(index, 'year', e.target.value)}
                                                    min="2020"
                                                    max="2030"
                                                />
                                            </div>
                                            <div className="form-field">
                                                <label>Месяц</label>
                                                <input
                                                    type="number"
                                                    value={record.month}
                                                    onChange={(e) => handleCostChange(index, 'month', e.target.value)}
                                                    min="1"
                                                    max="12"
                                                />
                                            </div>
                                            <div className="form-field">
                                                <label>Сумма</label>
                                                <input
                                                    type="number"
                                                    value={record.amount}
                                                    onChange={(e) => handleCostChange(index, 'amount', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-field">
                                                <label>Вид затрат</label>
                                                <select
                                                    value={record.costType}
                                                    onChange={(e) => handleCostChange(index, 'costType', e.target.value)}
                                                >
                                                    <option value="">Выберите вид</option>
                                                    {costTypes.map(type => (
                                                        <option key={type} value={type}>{type}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-field">
                                                <label>Статус отражения</label>
                                                <select
                                                    value={record.status}
                                                    onChange={(e) => handleCostChange(index, 'status', e.target.value)}
                                                >
                                                    <option value="">Выберите статус</option>
                                                    {costStatuses.map(status => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {formData.costs.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeCostRecord(index)}
                                                    className="remove-btn"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addCostRecord} className="add-btn">
                                    + Добавить запись затрат
                                </button>
                            </div>

                            {/* Дополнительная информация */}
                            <div className="form-group">
                                <h3>Дополнительная информация</h3>
                                <div className="form-field full-width">
                                    <label>Текущий статус по проекту (макс. 1000 символов)</label>
                                    <textarea
                                        name="currentStatus"
                                        value={formData.currentStatus}
                                        onChange={handleInputChange}
                                        maxLength="1000"
                                        rows="3"
                                    />
                                    <div className="char-count">{formData.currentStatus.length}/1000</div>
                                </div>

                                <div className="form-field full-width">
                                    <label>Что сделано за период (макс. 1000 символов)</label>
                                    <textarea
                                        name="periodAchievements"
                                        value={formData.periodAchievements}
                                        onChange={handleInputChange}
                                        maxLength="1000"
                                        rows="3"
                                    />
                                    <div className="char-count">{formData.periodAchievements.length}/1000</div>
                                </div>

                                <div className="form-field full-width">
                                    <label>Планы на следующий период (макс. 1000 символов)</label>
                                    <textarea
                                        name="nextPeriodPlans"
                                        value={formData.nextPeriodPlans}
                                        onChange={handleInputChange}
                                        maxLength="1000"
                                        rows="3"
                                    />
                                    <div className="char-count">{formData.nextPeriodPlans.length}/1000</div>
                                </div>
                            </div>

                            {/* Кнопки действий */}
                            <div className="action-buttons">
                                <button onClick={saveProject} className="save-btn">
                                    Сохранить проект
                                </button>
                                {currentProject && (
                                    <button onClick={deleteProject} className="delete-btn">
                                        Удалить проект
                                    </button>
                                )}
                                <button onClick={() => setActiveTab('search')} className="cancel-btn">
                                    Отмена
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default UserPA;