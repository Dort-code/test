import React, { useState, useEffect } from 'react';
import './UserPA.css';

const UserPA = () => {
    const [activeTab, setActiveTab] = useState('search');
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [searchInn, setSearchInn] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Состояние для заданий
    const [tasks, setTasks] = useState([]);
    const [tasksFilter, setTasksFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Текущий пользователь (в реальном приложении получается из контекста/авторизации)
    const currentUser = {
        id: 3, // ID текущего пользователя (Сидорова М.С.)
        name: 'Сидорова М.С.'
    };

    // Остальные константы и состояния без изменений
    const services = ['Интернет', 'Телефония', 'Инфобез', 'Цифровые сервисы', 'Облачные сервисы', 'Отраслевые решения'];
    const paymentTypes = ['Инсталляции', 'Сервисная', 'Оборудование', 'Разовые','Интеграционные проекты'];
    const projectStages = ['Лид', 'Подборка лида', 'КП', 'Пилот', 'Выделение финансирования', 'Закупка/торги', 'Заключение Д Д', 'Заключение РД', 'Реализация', 'Успех'];
    const businessSegments = ['Крупный сегмент', 'Госсектор', 'Малые предприятия', 'Средний сегмент'];
    const forecastAcceptance = ['ОЦЕНКА', 'ПКМ', 'ОТТОК', 'Delete', 'ДАШ_ПКМ'];
    const revenueStatuses = ['Начислена', 'Прогнозное начисление', 'Начисление планируется'];
    const costTypes = ['Продажа товаров', 'Прочие прямые', 'Субподряд', 'Аренда каналов', 'ГПХ', 'СВ по ГПХ', 'ПиПТ', 'Контент', 'Доставка счетов', 'Реклама', 'Комиссионные', 'РУО', 'РСД', 'Штрафы'];
    const costStatuses = ['Начислены', 'Создан резерв', 'Отражение планируется'];

    const serviceCategories = {
        'Интернет': 'Традиционный бизнес',
        'Телефония': 'Традиционный бизнес',
        'Инфобез': 'Кибербез',
        'Цифровые сервисы': 'Новый телеком',
        'Облачные сервисы': 'Новый телеком',
        'Отраслевые решения': 'Проектная деятельность'
    };

    const costCategories = {
        'Продажа товаров': 'Прямые',
        'Прочие прямые': 'Прямые',
        'Субподряд': 'Коммерческие',
        'Аренда каналов': 'Прямые',
        'ГПХ': 'Коммерческие',
        'СВ по ГПХ': 'Коммерческие',
        'ПиПТ': 'Прямые',
        'Контент': 'Прямые',
        'Доставка счетов': 'Прямые',
        'Реклама': 'Коммерческие',
        'Комиссионные': 'Коммерческие',
        'РУО': 'Прямые',
        'РСД': 'РСД',
        'Штрафы': 'Штрафы'
    };

    const stageProbabilities = {
        'Лид': 10,
        'Подборка лида': 10,
        'КП': 30,
        'Пилот': 40,
        'Выделение финансирования': 40,
        'Закупка/торги': 50,
        'Заключение Д Д': 70,
        'Заключение РД': 80,
        'Реализация': 90,
        'Успех': 100
    };

    const [formData, setFormData] = useState({
        // Общая информация
        organizationName: '',
        organizationInn: '',
        projectName: '',
        service: '',
        serviceCategory: '', // Новое поле для категории услуги
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
        costs: [{ year: '', month: '', amount: '', costType: '', costCategory: '', status: '' }], // Добавлено costCategory

        // Дополнительная информация
        currentStatus: '',
        periodAchievements: '',
        nextPeriodPlans: '',
        comments: []
    });

    // Загрузка заданий с бэкенда
    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            // Имитация API запроса
            const response = await fetch(`/api/tasks?user_id=${currentUser.id}`);

            if (!response.ok) {
                throw new Error('Ошибка загрузки заданий');
            }

            const tasksData = await response.json();
            setTasks(tasksData);
        } catch (err) {
            setError('Не удалось загрузить задания');
            console.error('Error fetching tasks:', err);

            // Заглушка с моковыми данными
            const mockTasks = [
                {
                    id: 1,
                    description: 'Проанализировать эффективность работы отдела продаж за последний квартал',
                    created_by: 'Сергеев С.С.',
                    created_by_id: 100,
                    assigned_to: 'Сидорова М.С.',
                    assigned_to_id: 3,
                    status: 'accepted',
                    created_at: '2024-03-15',
                    completed_at: null
                },
                {
                    id: 2,
                    description: 'Подготовить отчет по выполнению плана продаж за текущий месяц',
                    created_by: 'Петров А.В.',
                    created_by_id: 101,
                    assigned_to: 'Сидорова М.С.',
                    assigned_to_id: 3,
                    status: 'new',
                    created_at: '2024-03-18',
                    completed_at: null
                },
                {
                    id: 3,
                    description: 'Провести обучение новых менеджеров по продукту "Облачные сервисы"',
                    created_by: 'Иванова О.П.',
                    created_by_id: 102,
                    assigned_to: 'Сидорова М.С.',
                    assigned_to_id: 3,
                    status: 'completed',
                    created_at: '2024-03-10',
                    completed_at: '2024-03-14'
                }
            ];
            setTasks(mockTasks);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'tasks') {
            fetchTasks();
        }
    }, [activeTab]);

    // Фильтрация заданий для текущего пользователя
    const userTasks = tasks.filter(task => task.assigned_to_id === currentUser.id);

    const filteredTasks = userTasks.filter(task => {
        if (tasksFilter === 'all') return true;
        return task.status === tasksFilter;
    });

    // Принять задание
    const acceptTask = async (taskId) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: currentUser.id })
            });

            if (!response.ok) {
                throw new Error('Ошибка принятия задания');
            }

            setTasks(prev => prev.map(task =>
                task.id === taskId ? { ...task, status: 'accepted' } : task
            ));
        } catch (err) {
            setError('Не удалось принять задание');
            console.error('Error accepting task:', err);
        }
    };

    // Завершить задание
    const completeTask = async (taskId) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    completed_at: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка завершения задания');
            }

            setTasks(prev => prev.map(task =>
                task.id === taskId ? {
                    ...task,
                    status: 'completed',
                    completed_at: new Date().toISOString().split('T')[0]
                } : task
            ));
        } catch (err) {
            setError('Не удалось завершить задание');
            console.error('Error completing task:', err);
        }
    };

    // Форматирование даты
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    // Получение текста статуса
    const getStatusText = (status) => {
        const statusMap = {
            'new': '🆕 Новое',
            'accepted': '🔄 В работе',
            'completed': '✅ Выполнено'
        };
        return statusMap[status] || status;
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

        // Автоматическое обновление категории услуги
        if (name === 'service') {
            const category = serviceCategories[value] || '';
            setFormData(prev => ({
                ...prev,
                serviceCategory: category
            }));
        }
    };

    // Обновленный обработчик для затрат с автоматической категоризацией
    const handleCostChange = (index, field, value) => {
        const updatedCosts = [...formData.costs];
        updatedCosts[index][field] = value;

        // Автоматическое определение категории затрат при изменении вида затрат
        if (field === 'costType') {
            updatedCosts[index].costCategory = costCategories[value] || '';
        }

        setFormData(prev => ({ ...prev, costs: updatedCosts }));
    };

    // Обновленная функция добавления записи затрат
    const addCostRecord = () => {
        setFormData(prev => ({
            ...prev,
            costs: [...prev.costs, { year: '', month: '', amount: '', costType: '', costCategory: '', status: '' }]
        }));
    };

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
            serviceCategory: '',
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
            costs: [{ year: '', month: '', amount: '', costType: '', costCategory: '', status: '' }],
            currentStatus: '',
            periodAchievements: '',
            nextPeriodPlans: '',
            comments: []
        });
        setActiveTab('edit');
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

    // Удаление записи затрат
    const removeCostRecord = (index) => {
        setFormData(prev => ({
            ...prev,
            costs: prev.costs.filter((_, i) => i !== index)
        }));
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
                    <span>Пользователь: {currentUser.name}</span>
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
                <button
                    className={`nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tasks')}
                >
                    Мои задания
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
                                                <span>Услуга: {project.service} ({project.serviceCategory})</span>
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
                                        <label>Категория услуги</label>
                                        <input
                                            type="text"
                                            value={formData.serviceCategory}
                                            disabled
                                            className="disabled-field"
                                            placeholder="Заполняется автоматически"
                                        />
                                    </div>
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
                                </div>

                                <div className="form-row">
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
                                    <div className="form-field">
                                        <label>Вероятность реализации</label>
                                        <input
                                            type="text"
                                            value={`${formData.implementationProbability}%`}
                                            disabled
                                            className="disabled-field"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-field">
                                        <label>Менеджер</label>
                                        <input
                                            type="text"
                                            name="manager"
                                            value={formData.manager}
                                            onChange={handleInputChange}
                                        />
                                    </div>
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
                                </div>

                                <div className="form-row">
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
                                                <label>Категория затрат</label>
                                                <input
                                                    type="text"
                                                    value={record.costCategory}
                                                    disabled
                                                    className="disabled-field"
                                                    placeholder="Заполняется автоматически"
                                                />
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

                {activeTab === 'tasks' && (
                    <div className="tasks-tab">
                        <div className="tasks-container">
                            <div className="tasks-header">
                                <h2>Мои задания</h2>
                                <div className="tasks-filter">
                                    <label>Фильтр по статусу:</label>
                                    <select
                                        value={tasksFilter}
                                        onChange={(e) => setTasksFilter(e.target.value)}
                                        className="status-filter-select"
                                    >
                                        <option value="all">Все задания</option>
                                        <option value="new">Новые</option>
                                        <option value="accepted">В работе</option>
                                        <option value="completed">Выполненные</option>
                                    </select>
                                </div>
                            </div>

                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <div className="loading">Загрузка заданий...</div>
                            ) : (
                                <>
                                    <div className="tasks-stats">
                                        <div className="stat-item">
                                            <span className="stat-number">{userTasks.length}</span>
                                            <span className="stat-label">Всего заданий</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">{userTasks.filter(t => t.status === 'new').length}</span>
                                            <span className="stat-label">Новые</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">{userTasks.filter(t => t.status === 'accepted').length}</span>
                                            <span className="stat-label">В работе</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">{userTasks.filter(t => t.status === 'completed').length}</span>
                                            <span className="stat-label">Выполненные</span>
                                        </div>
                                    </div>

                                    <div className="tasks-list">
                                        {filteredTasks.length === 0 ? (
                                            <div className="no-tasks">
                                                <p>Нет заданий с выбранным статусом</p>
                                            </div>
                                        ) : (
                                            filteredTasks.map(task => (
                                                <div key={task.id} className={`task-card ${task.status}`}>
                                                    <div className="task-header">
                                                        <h4>Задание #{task.id}</h4>
                                                        <div className="task-meta">
                                                            <span className="task-creator">
                                                                От: {task.created_by}
                                                            </span>
                                                            <span className="task-date">
                                                                Создано: {formatDate(task.created_at)}
                                                            </span>
                                                            {task.completed_at && (
                                                                <span className="task-date">
                                                                    Выполнено: {formatDate(task.completed_at)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="task-description">
                                                        {task.description}
                                                    </div>
                                                    <div className="task-status-actions">
                                                        <div className="task-status">
                                                            <span className={`status-badge ${task.status}`}>
                                                                {getStatusText(task.status)}
                                                            </span>
                                                        </div>
                                                        <div className="task-actions">
                                                            {task.status === 'new' && (
                                                                <button
                                                                    className="action-btn accept-btn"
                                                                    onClick={() => acceptTask(task.id)}
                                                                >
                                                                    Принять задание
                                                                </button>
                                                            )}
                                                            {task.status === 'accepted' && (
                                                                <button
                                                                    className="action-btn complete-btn"
                                                                    onClick={() => completeTask(task.id)}
                                                                >
                                                                    Завершить задание
                                                                </button>
                                                            )}
                                                            {task.status === 'completed' && (
                                                                <span className="completed-text">✅ Задание завершено</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default UserPA;