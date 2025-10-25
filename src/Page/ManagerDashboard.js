import React, { useState, useEffect } from 'react';
import './UserPA.css';

const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState('search');
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [searchInn, setSearchInn] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Состояния для задач
    const [tasks, setTasks] = useState([]);
    const [chiefTasksFilter, setChiefTasksFilter] = useState('all');
    const [myTasksFilter, setMyTasksFilter] = useState('all');
    const [newTask, setNewTask] = useState({
        description: '',
        assigned_to: ''
    });

    // Текущий пользователь (Head of Department)
    const currentUser = {
        id: 3,
        name: 'Сидорова Мария Сергеевна',
        position: 'Менеджер по развитию',
        department: 'Отдел маркетинга',
        role: 'head_of_department'
    };

    // Моковые данные менеджеров
    const mockManagers = [
        {
            id: 1,
            name: 'Иванов Иван Иванович',
            position: 'Менеджер проектов',
            department: 'Отдел продаж',
            efficiency: 85,
            completedProjects: 12,
            currentProjects: 3,
            revenue: 4500000,
            costs: 1200000
        },
        {
            id: 2,
            name: 'Петров Петр Петрович',
            position: 'Старший менеджер',
            department: 'Отдел продаж',
            efficiency: 92,
            completedProjects: 18,
            currentProjects: 5,
            revenue: 6800000,
            costs: 1500000
        },
        {
            id: 5,
            name: 'Николаев Дмитрий Сергеевич',
            position: 'Менеджер',
            department: 'Отдел маркетинга',
            efficiency: 82,
            completedProjects: 10,
            currentProjects: 3,
            revenue: 3800000,
            costs: 950000
        }
    ];

    // Моковые данные задач от руководства
    const mockChiefTasks = [
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
            description: 'Подготовить отчет по внедрению новых бизнес-процессов',
            created_by: 'Сергеев С.С.',
            created_by_id: 100,
            assigned_to: 'Сидорова М.С.',
            assigned_to_id: 3,
            status: 'completed',
            created_at: '2024-03-10',
            completed_at: '2024-03-14'
        },
        {
            id: 3,
            description: 'Разработать план мероприятий по повышению эффективности отдела',
            created_by: 'Петрова М.В.',
            created_by_id: 101,
            assigned_to: 'Сидорова М.С.',
            assigned_to_id: 3,
            status: 'new',
            created_at: '2024-03-18',
            completed_at: null
        }
    ];

    // Моковые задачи, созданные текущим пользователем
    const mockMyTasks = [
        {
            id: 101,
            description: 'Подготовить коммерческое предложение для нового клиента',
            created_by: 'Сидорова М.С.',
            created_by_id: 3,
            assigned_to: 'Иванов И.И.',
            assigned_to_id: 1,
            status: 'accepted',
            created_at: '2024-03-14',
            completed_at: null
        },
        {
            id: 102,
            description: 'Обработать входящие заявки от потенциальных клиентов',
            created_by: 'Сидорова М.С.',
            created_by_id: 3,
            assigned_to: 'Петров П.П.',
            assigned_to_id: 2,
            status: 'new',
            created_at: '2024-03-15',
            completed_at: null
        },
        {
            id: 103,
            description: 'Проанализировать результаты маркетинговой кампании',
            created_by: 'Сидорова М.С.',
            created_by_id: 3,
            assigned_to: 'Николаев Д.С.',
            assigned_to_id: 5,
            status: 'completed',
            created_at: '2024-03-12',
            completed_at: '2024-03-16'
        }
    ];

    // Списки для выпадающих полей
    const services = ['Интернет', 'Телефония', 'Инфобез', 'Цифровые сервисы', 'Облачные сервисы', 'Отраслевые решения'];
    const paymentTypes = ['Инсталляции', 'Сервисная', 'Оборудование', 'Разовые','Интеграционные проекты'];
    const projectStages = ['Лид', 'Подборка лида', 'КП', 'Пилот', 'Выделение финансирования', 'Закупка/торги', 'Заключение Д Д', 'Заключение РД', 'Реализация', 'Успех'];
    const businessSegments = ['Крупный сегмент', 'Госсектор', 'Малые предприятия', 'Средний сегмент'];
    const forecastAcceptance = ['ОЦЕНКА', 'ПКМ', 'ОТТОК', 'Delete', 'ДАШ_ПКМ'];
    const revenueStatuses = ['Начислена', 'Прогнозное начисление', 'Начисление планируется'];
    const costTypes = ['Продажа товаров', 'Прочие прямые', 'Субподряд', 'Аренда каналов', 'ГПХ', 'СВ по ГПХ', 'ПиПТ', 'Контент', 'Доставка счетов', 'Реклама', 'Комиссионные', 'РУО', 'РСД', 'Штрафы'];
    const costStatuses = ['Начислены', 'Создан резерв', 'Отражение планируется'];

    // Маппинг услуг на категории
    const serviceCategories = {
        'Интернет': 'Традиционный бизнес',
        'Телефония': 'Традиционный бизнес',
        'Инфобез': 'Кибербез',
        'Цифровые сервисы': 'Новый телеком',
        'Облачные сервисы': 'Новый телеком',
        'Отраслевые решения': 'Проектная деятельность'
    };

    // Маппинг затрат на категории
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

    // Вероятность реализации по этапам
    const stageProbabilities = {
        'Лид' : 10,
        'Подборка лида' : 10,
        'КП' : 30,
        'Пилот' : 40,
        'Выделение финансирования' : 40,
        'Закупка/торги' : 50,
        'Заключение Д Д' : 70,
        'Заключение РД' : 80,
        'Реализация' : 90,
        'Успех' : 100
    };

    const [formData, setFormData] = useState({
        // Общая информация
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

        // Выручка
        revenue: [{ year: '', month: '', amount: '', status: '' }],

        // Затраты
        costs: [{ year: '', month: '', amount: '', costType: '', costCategory: '', status: '' }],

        // Дополнительная информация
        currentStatus: '',
        periodAchievements: '',
        nextPeriodPlans: '',
        comments: []
    });

    useEffect(() => {
        // Объединяем все задачи
        const allTasks = [...mockChiefTasks, ...mockMyTasks];
        setTasks(allTasks);
    }, []);

    // Получение списка менеджеров для назначения задач
    const getManagerEmployees = () => {
        return mockManagers;
    };

    // Фильтрация задач
    const chiefTasks = tasks.filter(task => task.created_by_id !== currentUser.id);
    const myTasks = tasks.filter(task => task.created_by_id === currentUser.id);

    const filteredChiefTasks = chiefTasks.filter(task => {
        if (chiefTasksFilter === 'all') return true;
        return task.status === chiefTasksFilter;
    });

    const filteredMyTasks = myTasks.filter(task => {
        if (myTasksFilter === 'all') return true;
        return task.status === myTasksFilter;
    });

    // Функция для получения текста статуса фильтра
    const getStatusFilterText = (filter) => {
        const texts = {
            'all': 'Все статусы',
            'new': 'Новые',
            'accepted': 'В работе',
            'completed': 'Выполненные'
        };
        return texts[filter] || filter;
    };

    // Функция для создания новой задачи для менеджера
    const handleCreateTask = (e) => {
        e.preventDefault();

        if (!newTask.description.trim() || !newTask.assigned_to) {
            alert('Заполните описание задания и выберите исполнителя');
            return;
        }

        const assignedManager = mockManagers.find(manager => manager.id === parseInt(newTask.assigned_to));

        const newTaskObj = {
            id: Date.now(),
            description: newTask.description,
            created_by: currentUser.name,
            created_by_id: currentUser.id,
            assigned_to: assignedManager.name,
            assigned_to_id: assignedManager.id,
            status: 'new',
            created_at: new Date().toISOString().split('T')[0],
            completed_at: null
        };

        setTasks(prev => [newTaskObj, ...prev]);
        setNewTask({
            description: '',
            assigned_to: ''
        });

        alert('Задание успешно создано!');
    };

    // Функции для работы с задачами от руководства
    const acceptTask = (taskId) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, status: 'accepted' } : task
        ));
    };

    const completeTask = (taskId) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? {
                ...task,
                status: 'completed',
                completed_at: new Date().toISOString().split('T')[0]
            } : task
        ));
    };

    // Обработчик изменений формы проекта
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
                    Задания
                </button>
            </nav>

            <main className="dashboard-main">
                {/* Вкладка Поиск проектов */}
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

                {/* Вкладка Редактирование проекта */}
                {activeTab === 'edit' && (
                    <div className="edit-tab">
                        <div className="form-section">
                            <h2>{currentProject ? 'Редактирование проекта' : 'Создание нового проекта'}</h2>

                            {/* Форма проекта - оставлена без изменений */}
                            {/* ... остальной код формы проекта ... */}
                        </div>
                    </div>
                )}

                {/* Вкладка Управление заданиями */}
                {activeTab === 'tasks' && (
                    <div className="tasks-tab">
                        <div className="tasks-container">
                            {/* Создание нового задания для менеджеров */}
                            <div className="create-task-section">
                                <h3>Создать задание для менеджера</h3>
                                <form onSubmit={handleCreateTask} className="task-form">
                                    <div className="form-field">
                                        <label>Описание задания *</label>
                                        <textarea
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                            placeholder="Опишите задание для менеджера..."
                                            rows="4"
                                            required
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Назначить менеджеру *</label>
                                        <select
                                            value={newTask.assigned_to}
                                            onChange={(e) => setNewTask({...newTask, assigned_to: e.target.value})}
                                            required
                                        >
                                            <option value="">Выберите менеджера</option>
                                            {getManagerEmployees().map(employee => (
                                                <option key={employee.id} value={employee.id}>
                                                    {employee.name} - {employee.department}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="create-task-btn">
                                        Создать задание
                                    </button>
                                </form>
                            </div>

                            {/* Разделенные списки заданий */}
                            <div className="tasks-lists-sections">
                                {/* Задания от Chief */}
                                <div className="tasks-list-section chief-tasks">
                                    <div className="section-header">
                                        <h3>📋 Задания от руководства</h3>
                                        <div className="tasks-controls">
                                            <div className="sort-filter">
                                                <label>Статус:</label>
                                                <select
                                                    value={chiefTasksFilter}
                                                    onChange={(e) => setChiefTasksFilter(e.target.value)}
                                                    className="status-filter-select"
                                                >
                                                    <option value="all">Все</option>
                                                    <option value="new">Новые</option>
                                                    <option value="accepted">В работе</option>
                                                    <option value="completed">Выполненные</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tasks-stats">
                                        <div className="stat-item">
                                            <span className="stat-number">{chiefTasks.length}</span>
                                            <span className="stat-label">Всего заданий</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">{chiefTasks.filter(t => t.status === 'new').length}</span>
                                            <span className="stat-label">Новые</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">{chiefTasks.filter(t => t.status === 'accepted').length}</span>
                                            <span className="stat-label">В работе</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">{chiefTasks.filter(t => t.status === 'completed').length}</span>
                                            <span className="stat-label">Выполненные</span>
                                        </div>
                                    </div>

                                    <div className="tasks-list">
                                        {filteredChiefTasks.length === 0 ? (
                                            <div className="no-tasks">
                                                <p>{chiefTasksFilter === 'all' ? 'Нет заданий от руководства' : `Нет заданий от руководства со статусом "${getStatusFilterText(chiefTasksFilter)}"`}</p>
                                            </div>
                                        ) : (
                                            filteredChiefTasks.map(task => (
                                                <div key={task.id} className={`task-card ${task.status}`}>
                                                    <div className="task-header">
                                                        <h4>Задание #{task.id}</h4>
                                                        <div className="task-meta">
                                                            <span className="task-source chief-source">
                                                                От: {task.created_by}
                                                            </span>
                                                            <span className="task-date">Создано: {task.created_at}</span>
                                                            {task.completed_at && (
                                                                <span className="task-date">Выполнено: {task.completed_at}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="task-description">
                                                        {task.description}
                                                    </div>
                                                    <div className="task-status">
                                                        <span className={`status-badge ${task.status}`}>
                                                            {task.status === 'new' && '🆕 Новое'}
                                                            {task.status === 'accepted' && '🔄 В работе'}
                                                            {task.status === 'completed' && '✅ Выполнено'}
                                                        </span>
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
                                                                    Отметить выполненным
                                                                </button>
                                                            )}
                                                            {task.status === 'completed' && (
                                                                <span className="completed-text">Задание завершено</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Задания созданные Head of Department */}
                                <div className="tasks-list-section my-tasks">
                                    <div className="section-header">
                                        <h3>👤 Мои задания для менеджеров</h3>
                                        <div className="tasks-controls">
                                            <div className="sort-filter">
                                                <label>Статус:</label>
                                                <select
                                                    value={myTasksFilter}
                                                    onChange={(e) => setMyTasksFilter(e.target.value)}
                                                    className="status-filter-select"
                                                >
                                                    <option value="all">Все</option>
                                                    <option value="new">Новые</option>
                                                    <option value="accepted">В работе</option>
                                                    <option value="completed">Выполненные</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tasks-stats">
                                        <div className="stat-item">
                                            <span className="stat-number">{myTasks.length}</span>
                                            <span className="stat-label">Всего создано</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">{myTasks.filter(t => t.status === 'new').length}</span>
                                            <span className="stat-label">Новые</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">{myTasks.filter(t => t.status === 'accepted').length}</span>
                                            <span className="stat-label">В работе</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">{myTasks.filter(t => t.status === 'completed').length}</span>
                                            <span className="stat-label">Выполненные</span>
                                        </div>
                                    </div>

                                    <div className="tasks-list">
                                        {filteredMyTasks.length === 0 ? (
                                            <div className="no-tasks">
                                                <p>{myTasksFilter === 'all' ? 'Нет созданных заданий' : `Нет созданных заданий со статусом "${getStatusFilterText(myTasksFilter)}"`}</p>
                                            </div>
                                        ) : (
                                            filteredMyTasks.map(task => (
                                                <div key={task.id} className={`task-card ${task.status}`}>
                                                    <div className="task-header">
                                                        <h4>Задание #{task.id}</h4>
                                                        <div className="task-meta">
                                                            <span className="task-source my-source">
                                                                Создал: {task.created_by}
                                                            </span>
                                                            <span className="assigned-to">Назначено: {task.assigned_to}</span>
                                                            <span className="task-date">Создано: {task.created_at}</span>
                                                            {task.completed_at && (
                                                                <span className="task-date">Выполнено: {task.completed_at}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="task-description">
                                                        {task.description}
                                                    </div>
                                                    <div className="task-status">
                                                        <span className={`status-badge ${task.status}`}>
                                                            {task.status === 'new' && '🆕 Ожидает принятия'}
                                                            {task.status === 'accepted' && '🔄 В работе у менеджера'}
                                                            {task.status === 'completed' && '✅ Выполнено менеджером'}
                                                        </span>
                                                        <div className="task-info">
                                                            {task.status === 'new' && (
                                                                <span className="info-text">Ожидает принятия менеджером</span>
                                                            )}
                                                            {task.status === 'accepted' && (
                                                                <span className="info-text">Менеджер работает над заданием</span>
                                                            )}
                                                            {task.status === 'completed' && (
                                                                <span className="info-text">Менеджер завершил задание</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ManagerDashboard;