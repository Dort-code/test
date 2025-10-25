import React, { useState, useEffect } from 'react';
import './HeadOfDepartmentDashboard.css';

const HeadOfDepartmentDashboard = () => {
    const [activeTab, setActiveTab] = useState('employees');
    const [employees, setEmployees] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [editingProject, setEditingProject] = useState(null);

    // Состояния для поиска и фильтров
    const [searchTerm, setSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState('');
    const [probabilityFilter, setProbabilityFilter] = useState('');
    const [sortBy, setSortBy] = useState('name');


    // Новые состояния для системы заданий
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        description: '',
        assigned_to: ''
    });
    const [chiefTasksFilter, setChiefTasksFilter] = useState('all');
    const [myTasksFilter, setMyTasksFilter] = useState('all');

    // Текущий пользователь (Head of Department)
    const currentUser = {
        id: 3,
        name: 'Сидорова Мария Сергеевна',
        position: 'Менеджер по развитию',
        department: 'Отдел маркетинга',
        role: 'head_of_department'
    };

    // Моковые данные сотрудников (добавляем роли)
    const mockEmployees = [
        {
            id: 1,
            name: 'Иванов Иван Иванович',
            position: 'Менеджер проектов',
            department: 'Отдел продаж',
            efficiency: 85,
            completedProjects: 12,
            currentProjects: 3,
            revenue: 4500000,
            costs: 1200000,
            role: 'manager'
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
            costs: 1500000,
            role: 'manager'
        },
        {
            id: 3,
            name: 'Сидорова Мария Сергеевна',
            position: 'Менеджер по развитию',
            department: 'Отдел маркетинга',
            efficiency: 78,
            completedProjects: 8,
            currentProjects: 4,
            revenue: 3200000,
            costs: 900000,
            role: 'head_of_department'
        },
        {
            id: 4,
            name: 'Козлов Алексей Владимирович',
            position: 'Аналитик',
            department: 'Аналитический отдел',
            efficiency: 88,
            completedProjects: 15,
            currentProjects: 2,
            revenue: 5200000,
            costs: 1100000,
            role: 'manager'
        }
    ];

    // Моковые данные проектов
    const mockProjects = [
        {
            id: 1,
            organizationName: 'ООО "ТехноПром"',
            projectName: 'Внедрение облачной инфраструктуры',
            manager: 'Иванов И.И.',
            projectStage: 'Реализация',
            implementationProbability: 90,
            revenue: [
                { year: '2024', month: '01', amount: 500000, status: 'Начислена' },
                { year: '2024', month: '02', amount: 750000, status: 'Начислена' }
            ],
            costs: [
                { year: '2024', month: '01', amount: 200000, costType: 'Оборудование', status: 'Начислены' },
                { year: '2024', month: '02', amount: 150000, costType: 'Субподряд', status: 'Начислены' }
            ],
            projectHistory: [
                { date: '2024-01-15', stage: 'КП', description: 'Подготовлено коммерческое предложение' },
                { date: '2024-02-01', stage: 'Заключение Д Д', description: 'Подписан договор' },
                { date: '2024-02-15', stage: 'Реализация', description: 'Начало реализации проекта' }
            ]
        },
        {
            id: 2,
            organizationName: 'АО "ГорСвет"',
            projectName: 'Модернизация системы связи',
            manager: 'Петров П.П.',
            projectStage: 'Заключение РД',
            implementationProbability: 80,
            revenue: [
                { year: '2024', month: '01', amount: 300000, status: 'Начислена' }
            ],
            costs: [
                { year: '2024', month: '01', amount: 120000, costType: 'Аренда каналов', status: 'Начислены' }
            ],
            projectHistory: [
                { date: '2023-12-10', stage: 'Лид', description: 'Получена заявка' },
                { date: '2024-01-05', stage: 'КП', description: 'Отправлено КП' },
                { date: '2024-02-20', stage: 'Заключение РД', description: 'Согласование технической документации' }
            ]
        }
    ];

    // Моковые данные заданий (от Chief и созданные Head of Department)
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
            description: 'Разработать план обучения для новых менеджеров',
            created_by: 'Сидорова М.С.',
            created_by_id: 3,
            assigned_to: 'Иванов И.И.',
            assigned_to_id: 1,
            status: 'new',
            created_at: '2024-03-18',
            completed_at: null
        },
        {
            id: 4,
            description: 'Провести аудит текущих проектов',
            created_by: 'Сидорова М.С.',
            created_by_id: 3,
            assigned_to: 'Петров П.П.',
            assigned_to_id: 2,
            status: 'accepted',
            created_at: '2024-03-16',
            completed_at: null
        }
    ];

    useEffect(() => {
        // Загрузка данных сотрудников и проектов
        setEmployees(mockEmployees);
        setProjects(mockProjects);
        setTasks(mockTasks);
    }, []);

    // Разделяем задачи на два массива
    const chiefTasks = tasks.filter(task => task.created_by_id !== currentUser.id);
    const myTasks = tasks.filter(task => task.created_by_id === currentUser.id);

    // Фильтруем задачи для каждого раздела
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

    // Получение менеджеров для выпадающего списка
    const getManagerEmployees = () => {
        return employees.filter(emp => emp.role === 'manager');
    };

    // Функция для создания нового задания
    const handleCreateTask = (e) => {
        e.preventDefault();

        if (!newTask.description.trim() || !newTask.assigned_to) {
            alert('Заполните описание задания и выберите исполнителя');
            return;
        }

        const assignedEmployee = employees.find(emp => emp.id === parseInt(newTask.assigned_to));

        const newTaskObj = {
            id: Date.now(),
            description: newTask.description,
            created_by: currentUser.name,
            created_by_id: currentUser.id,
            assigned_to: assignedEmployee.name,
            assigned_to_id: assignedEmployee.id,
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

    // Функция для принятия задания от Chief
    const acceptTask = (taskId) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, status: 'accepted' } : task
        ));
        alert('Задание принято к исполнению!');
    };

    // Функция для отметки задания как выполненного
    const completeTask = (taskId) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId ? {
                ...task,
                status: 'completed',
                completed_at: new Date().toISOString().split('T')[0]
            } : task
        ));
        alert('Задание отмечено как выполненное!');
    };

    // Функции для фильтрации и поиска
    const filteredProjects = projects.filter(project => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm ||
            project.projectName.toLowerCase().includes(searchLower) ||
            project.organizationName.toLowerCase().includes(searchLower) ||
            project.manager.toLowerCase().includes(searchLower);

        const matchesStage = !stageFilter || project.projectStage === stageFilter;

        const matchesProbability = !probabilityFilter ||
            (probabilityFilter === 'high' && project.implementationProbability >= 80) ||
            (probabilityFilter === 'medium' && project.implementationProbability >= 50 && project.implementationProbability < 80) ||
            (probabilityFilter === 'low' && project.implementationProbability < 50);

        return matchesSearch && matchesStage && matchesProbability;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.projectName.localeCompare(b.projectName);
            case 'stage':
                return a.projectStage.localeCompare(b.projectStage);
            case 'probability':
                return b.implementationProbability - a.implementationProbability;
            case 'revenue':
                const revenueA = a.revenue.reduce((sum, r) => sum + r.amount, 0);
                const revenueB = b.revenue.reduce((sum, r) => sum + r.amount, 0);
                return revenueB - revenueA;
            case 'recent':
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            default:
                return 0;
        }
    });

    // Функция очистки фильтров
    const clearFilters = () => {
        setSearchTerm('');
        setStageFilter('');
        setProbabilityFilter('');
        setSortBy('name');
    };

    // Вспомогательные функции
    const getProbabilityLevel = (probability) => {
        if (probability >= 80) return 'high';
        if (probability >= 50) return 'medium';
        return 'low';
    };

    const getProbabilityFilterText = (filter) => {
        const texts = {
            'high': 'Высокая',
            'medium': 'Средняя',
            'low': 'Низкая'
        };
        return texts[filter] || filter;
    };

    const calculateProjectProfitability = (project) => {
        const totalRevenue = project.revenue.reduce((sum, r) => sum + r.amount, 0);
        const totalCosts = project.costs.reduce((sum, c) => sum + c.amount, 0);
        if (totalRevenue === 0) return 0;
        return Math.round(((totalRevenue - totalCosts) / totalRevenue) * 100);
    };

    const viewProjectDetails = (project) => {
        const totalRevenue = project.revenue.reduce((sum, r) => sum + r.amount, 0);
        const totalCosts = project.costs.reduce((sum, c) => sum + c.amount, 0);
        const profitability = calculateProjectProfitability(project);

        alert(`Детали проекта: ${project.projectName}\n\n` +
            `Организация: ${project.organizationName}\n` +
            `Менеджер: ${project.manager}\n` +
            `Этап: ${project.projectStage}\n` +
            `Вероятность: ${project.implementationProbability}%\n` +
            `Выручка: ${totalRevenue.toLocaleString()} ₽\n` +
            `Затраты: ${totalCosts.toLocaleString()} ₽\n` +
            `Рентабельность: ${profitability}%`);
    };

    // Функция для расчета эффективности
    const calculateEfficiency = (employee) => {
        if (employee.revenue === 0) return 0;
        return Math.round(((employee.revenue - employee.costs) / employee.revenue) * 100);
    };

    // Функция для загрузки проекта для анализа
    const loadProjectForAnalysis = (project) => {
        setSelectedProject(project);
        setActiveTab('analytics');
    };

    // Функция для редактирования проекта
    const editProject = (project) => {
        setEditingProject(project);
        setActiveTab('edit-project');
    };

    // Функция для сохранения изменений проекта
    const saveProject = (updatedProject) => {
        setProjects(prev =>
            prev.map(p => p.id === updatedProject.id ? updatedProject : p)
        );
        setEditingProject(null);
        setActiveTab('projects');
        alert('Проект успешно обновлен!');
    };

    // Функция для отмены редактирования
    const cancelEdit = () => {
        setEditingProject(null);
        setActiveTab('projects');
    };

    return (
        <div className="chief-dashboard">
            <header className="dashboard-header">
                <h1>Панель управления главы отдела</h1>
                <div className="user-info">
                    <span>Глава отдела: {currentUser.name}</span>
                </div>
            </header>

            <nav className="chief-nav">
                <button
                    className={`nav-btn ${activeTab === 'employees' ? 'active' : ''}`}
                    onClick={() => setActiveTab('employees')}
                >
                    Рабочие
                </button>
                <button
                    className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                >
                    Сводный отчёт
                </button>
                <button
                    className={`nav-btn ${activeTab === 'projects' ? 'active' : ''}`}
                    onClick={() => setActiveTab('projects')}
                >
                    Редактирование проектов
                </button>
                <button
                    className={`nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tasks')}
                >
                    Управление заданиями
                </button>
                <button
                    className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                >
                    Аналитический дашборд
                </button>
            </nav>

            <main className="dashboard-main">
                {/* Вкладка Рабочие */}
                {activeTab === 'employees' && (
                    <div className="employees-tab">
                        <h2>Список работников отдела</h2>
                        <div className="employees-grid">
                            {employees.map(employee => (
                                <div key={employee.id} className="employee-card">
                                    <div className="employee-header">
                                        <h3>{employee.name}</h3>
                                        <span className={`role-badge ${employee.role}`}>
                                            {employee.role === 'manager' ? 'Менеджер' : 'Сотрудник'}
                                        </span>
                                        <span className={`efficiency-badge efficiency-${Math.floor(employee.efficiency / 20)}`}>
                                            {employee.efficiency}%
                                        </span>
                                    </div>
                                    <div className="employee-info">
                                        <p><strong>Должность:</strong> {employee.position}</p>
                                        <p><strong>Отдел:</strong> {employee.department}</p>
                                        <p><strong>Завершено проектов:</strong> {employee.completedProjects}</p>
                                        <p><strong>Текущие проекты:</strong> {employee.currentProjects}</p>
                                        <p><strong>Выручка:</strong> {employee.revenue.toLocaleString()} ₽</p>
                                        <p><strong>Затраты:</strong> {employee.costs.toLocaleString()} ₽</p>
                                        <p><strong>Эффективность:</strong> {calculateEfficiency(employee)}%</p>
                                    </div>
                                    <div className="employee-stats">
                                        <div className="stat-bar">
                                            <div
                                                className="stat-fill"
                                                style={{width: `${employee.efficiency}%`}}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Вкладка Сводный отчёт */}
                {activeTab === 'reports' && (
                    <div className="reports-tab">
                        <h2>Сводный отчёт</h2>
                        <div className="reports-placeholder">
                            <div className="placeholder-content">
                                <h3>Раздел в разработке</h3>
                                <p>Здесь будут отображаться сводные отчёты по отделу</p>
                                <div className="placeholder-stats">
                                    <div className="stat-item">
                                        <span className="stat-number">{employees.length}</span>
                                        <span className="stat-label">Сотрудников</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{projects.length}</span>
                                        <span className="stat-label">Активных проектов</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">
                                            {employees.reduce((sum, emp) => sum + emp.revenue, 0).toLocaleString()} ₽
                                        </span>
                                        <span className="stat-label">Общая выручка</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Вкладка Редактирование проектов */}
                {activeTab === 'projects' && (
                    <div className="projects-tab">
                        <div className="projects-header">
                            <h2>Редактирование карточек проектов</h2>
                            <div className="projects-controls">
                                <div className="search-filters">
                                    <div className="search-box">
                                        <input
                                            type="text"
                                            placeholder="Поиск по названию проекта, организации или менеджеру..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="search-input"
                                        />
                                        <button className="search-btn">
                                            🔍
                                        </button>
                                    </div>

                                    <div className="filters-row">
                                        <div className="filter-group">
                                            <label>Этап проекта:</label>
                                            <select
                                                value={stageFilter}
                                                onChange={(e) => setStageFilter(e.target.value)}
                                                className="filter-select"
                                            >
                                                <option value="">Все этапы</option>
                                                <option value="Лид">Лид</option>
                                                <option value="Подборка лида">Подборка лида</option>
                                                <option value="КП">КП</option>
                                                <option value="Пилот">Пилот</option>
                                                <option value="Выделение финансирования">Выделение финансирования</option>
                                                <option value="Закупка/торги">Закупка/торги</option>
                                                <option value="Заключение Д Д">Заключение Д Д</option>
                                                <option value="Заключение РД">Заключение РД</option>
                                                <option value="Реализация">Реализация</option>
                                                <option value="Успех">Успех</option>
                                            </select>
                                        </div>

                                        <div className="filter-group">
                                            <label>Вероятность:</label>
                                            <select
                                                value={probabilityFilter}
                                                onChange={(e) => setProbabilityFilter(e.target.value)}
                                                className="filter-select"
                                            >
                                                <option value="">Любая вероятность</option>
                                                <option value="high">Высокая (80-100%)</option>
                                                <option value="medium">Средняя (50-79%)</option>
                                                <option value="low">Низкая (0-49%)</option>
                                            </select>
                                        </div>

                                        <div className="filter-group">
                                            <label>Сортировка:</label>
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="filter-select"
                                            >
                                                <option value="name">По названию</option>
                                                <option value="stage">По этапу</option>
                                                <option value="probability">По вероятности</option>
                                                <option value="revenue">По выручке</option>
                                                <option value="recent">Сначала новые</option>
                                            </select>
                                        </div>

                                        <button
                                            onClick={clearFilters}
                                            className="clear-filters-btn"
                                        >
                                            Очистить фильтры
                                        </button>
                                    </div>
                                </div>

                                <div className="filter-stats">
                                    <span>Найдено проектов: {filteredProjects.length}</span>
                                    {(searchTerm || stageFilter || probabilityFilter) && (
                                        <span className="active-filters">
                                            Активные фильтры:
                                            {searchTerm && ` поиск: "${searchTerm}"`}
                                            {stageFilter && ` этап: ${stageFilter}`}
                                            {probabilityFilter && ` вероятность: ${getProbabilityFilterText(probabilityFilter)}`}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="projects-list">
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map(project => (
                                    <div key={project.id} className="project-management-card">
                                        <div className="project-main-info">
                                            <h3>{project.projectName}</h3>
                                            <p><strong>Организация:</strong> {project.organizationName}</p>
                                            <p><strong>Менеджер:</strong> {project.manager}</p>
                                            <div className="project-tags">
                                                <span className={`stage-tag stage-${project.projectStage.replace(/\s+/g, '-')}`}>
                                                    {project.projectStage}
                                                </span>
                                                <span className={`probability-tag probability-${getProbabilityLevel(project.implementationProbability)}`}>
                                                    {project.implementationProbability}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="project-finance">
                                            <p><strong>Выручка:</strong> {project.revenue.reduce((sum, r) => sum + r.amount, 0).toLocaleString()} ₽</p>
                                            <p><strong>Затраты:</strong> {project.costs.reduce((sum, c) => sum + c.amount, 0).toLocaleString()} ₽</p>
                                            <p><strong>Рентабельность:</strong>
                                                {calculateProjectProfitability(project)}%
                                            </p>
                                        </div>
                                        <div className="project-actions">
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => editProject(project)}
                                            >
                                                ✏️ Редактировать
                                            </button>
                                            <button
                                                className="action-btn analyze-btn"
                                                onClick={() => loadProjectForAnalysis(project)}
                                            >
                                                📊 Анализировать
                                            </button>
                                            <button
                                                className="action-btn view-btn"
                                                onClick={() => viewProjectDetails(project)}
                                            >
                                                👁️ Просмотреть
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-projects">
                                    <h3>Проекты не найдены</h3>
                                    <p>Попробуйте изменить параметры поиска или фильтры</p>
                                    <button onClick={clearFilters} className="clear-filters-btn">
                                        Очистить все фильтры
                                    </button>
                                </div>
                            )}
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

                {/* Вкладка Аналитический дашборд */}
                {activeTab === 'analytics' && (
                    <div className="analytics-tab">
                        <h2>Аналитический дашборд</h2>

                        {selectedProject ? (
                            <div className="project-analytics">
                                <div className="analytics-header">
                                    <h3>Анализ проекта: {selectedProject.projectName}</h3>
                                    <button
                                        className="back-btn"
                                        onClick={() => setSelectedProject(null)}
                                    >
                                        ← Назад к списку
                                    </button>
                                </div>

                                {/* Диаграмма Ганта */}
                                <div className="gantt-chart">
                                    <h4>Диаграмма Ганта по этапам проекта</h4>
                                    <div className="gantt-container">
                                        {selectedProject.projectHistory.map((history, index) => (
                                            <div key={index} className="gantt-item">
                                                <div className="gantt-stage">
                                                    <span className="stage-name">{history.stage}</span>
                                                    <span className="stage-date">{history.date}</span>
                                                </div>
                                                <div className="gantt-bar">
                                                    <div
                                                        className="gantt-progress"
                                                        style={{
                                                            width: `${(index + 1) * 10}%`,
                                                            backgroundColor: getStageColor(history.stage)
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Финансовая аналитика */}
                                <div className="financial-analytics">
                                    <div className="revenue-analysis">
                                        <h4>Выручка по месяцам</h4>
                                        <div className="revenue-histogram">
                                            {selectedProject.revenue.map((rev, index) => {
                                                const maxAmount = Math.max(...selectedProject.revenue.map(r => r.amount));
                                                const height = maxAmount > 0 ? (rev.amount / maxAmount) * 100 : 0;

                                                return (
                                                    <div key={index} className="histogram-column">
                                                        <div className="column-wrapper">
                                                            <div
                                                                className="column-fill"
                                                                style={{ height: `${height}%` }}
                                                                title={`${rev.amount.toLocaleString()} ₽`}
                                                            ></div>
                                                        </div>
                                                        <div className="column-label">
                                                            <span className="month-label">{rev.month}/{rev.year}</span>
                                                            <span className="amount-label">{rev.amount.toLocaleString()} ₽</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="costs-analysis">
                                        <h4>Затраты по видам</h4>
                                        <div className="costs-chart">
                                            {selectedProject.costs.map((cost, index) => {
                                                const maxAmount = Math.max(...selectedProject.costs.map(c => c.amount));
                                                const width = maxAmount > 0 ? (cost.amount / maxAmount) * 100 : 0;

                                                return (
                                                    <div key={index} className="cost-item">
                                                        <span className="cost-type">{cost.costType}</span>
                                                        <div className="cost-bar">
                                                            <div
                                                                className="cost-fill"
                                                                style={{ width: `${width}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="cost-amount">{cost.amount.toLocaleString()} ₽</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Сводная статистика */}
                                <div className="summary-stats">
                                    <div className="stat-card">
                                        <h5>Общая выручка</h5>
                                        <span className="stat-value">
                                            {selectedProject.revenue.reduce((sum, r) => sum + r.amount, 0).toLocaleString()} ₽
                                        </span>
                                    </div>
                                    <div className="stat-card">
                                        <h5>Общие затраты</h5>
                                        <span className="stat-value">
                                            {selectedProject.costs.reduce((sum, c) => sum + c.amount, 0).toLocaleString()} ₽
                                        </span>
                                    </div>
                                    <div className="stat-card">
                                        <h5>Рентабельность</h5>
                                        <span className="stat-value">
                                            {Math.round(
                                                ((selectedProject.revenue.reduce((sum, r) => sum + r.amount, 0) -
                                                        selectedProject.costs.reduce((sum, c) => sum + c.amount, 0)) /
                                                    selectedProject.revenue.reduce((sum, r) => sum + r.amount, 0)) * 100
                                            )}%
                                        </span>
                                    </div>
                                    <div className="stat-card">
                                        <h5>Количество этапов</h5>
                                        <span className="stat-value">
                                            {selectedProject.projectHistory.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="project-selection">
                                <h3>Выберите проект для анализа</h3>
                                <div className="projects-grid">
                                    {projects.map(project => (
                                        <div
                                            key={project.id}
                                            className="project-select-card"
                                            onClick={() => setSelectedProject(project)}
                                        >
                                            <h4>{project.projectName}</h4>
                                            <p>{project.organizationName}</p>
                                            <p><strong>Менеджер:</strong> {project.manager}</p>
                                            <p><strong>Этап:</strong> {project.projectStage}</p>
                                            <div className="project-metrics">
                                                <span className="metric revenue">
                                                    Выручка: {project.revenue.reduce((sum, r) => sum + r.amount, 0).toLocaleString()} ₽
                                                </span>
                                                <span className="metric stage">
                                                    Вероятность: {project.implementationProbability}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Вкладка Редактирование проекта */}
                {activeTab === 'edit-project' && editingProject && (
                    <div className="edit-project-tab">
                        <div className="edit-project-header">
                            <h2>Редактирование проекта: {editingProject.projectName}</h2>
                            <button className="back-btn" onClick={cancelEdit}>
                                ← Назад к списку
                            </button>
                        </div>

                        <ProjectEditForm
                            project={editingProject}
                            onSave={saveProject}
                            onCancel={cancelEdit}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

// Компонент формы редактирования проекта
const ProjectEditForm = ({ project, onSave, onCancel }) => {
    const [formData, setFormData] = useState(project);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleRevenueChange = (index, field, value) => {
        const updatedRevenue = [...formData.revenue];
        updatedRevenue[index][field] = value;
        setFormData(prev => ({ ...prev, revenue: updatedRevenue }));
    };

    const handleCostChange = (index, field, value) => {
        const updatedCosts = [...formData.costs];
        updatedCosts[index][field] = value;
        setFormData(prev => ({ ...prev, costs: updatedCosts }));
    };

    return (
        <form onSubmit={handleSubmit} className="project-edit-form">
            <div className="form-section">
                <h3>Основная информация</h3>
                <div className="form-row">
                    <div className="form-field">
                        <label>Название организации</label>
                        <input
                            type="text"
                            name="organizationName"
                            value={formData.organizationName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-field">
                        <label>Название проекта</label>
                        <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleInputChange}
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
                        <label>Этап проекта</label>
                        <select
                            name="projectStage"
                            value={formData.projectStage}
                            onChange={handleInputChange}
                        >
                            <option value="Лид">Лид</option>
                            <option value="Подборка лида">Подборка лида</option>
                            <option value="КП">КП</option>
                            <option value="Пилот">Пилот</option>
                            <option value="Выделение финансирования">Выделение финансирования</option>
                            <option value="Закупка/торги">Закупка/торги</option>
                            <option value="Заключение Д Д">Заключение Д Д</option>
                            <option value="Заключение РД">Заключение РД</option>
                            <option value="Реализация">Реализация</option>
                            <option value="Успех">Успех</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>Выручка</h3>
                {formData.revenue.map((rev, index) => (
                    <div key={index} className="revenue-record">
                        <div className="form-row">
                            <div className="form-field">
                                <label>Год</label>
                                <input
                                    type="number"
                                    value={rev.year}
                                    onChange={(e) => handleRevenueChange(index, 'year', e.target.value)}
                                />
                            </div>
                            <div className="form-field">
                                <label>Месяц</label>
                                <input
                                    type="number"
                                    value={rev.month}
                                    onChange={(e) => handleRevenueChange(index, 'month', e.target.value)}
                                />
                            </div>
                            <div className="form-field">
                                <label>Сумма</label>
                                <input
                                    type="number"
                                    value={rev.amount}
                                    onChange={(e) => handleRevenueChange(index, 'amount', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="form-actions">
                <button type="submit" className="save-btn">Сохранить изменения</button>
                <button type="button" className="cancel-btn" onClick={onCancel}>Отмена</button>
            </div>
        </form>
    );
};

// Вспомогательная функция для цветов этапов
const getStageColor = (stage) => {
    const colors = {
        'Лид': '#ff6b6b',
        'Подборка лида': '#ffa726',
        'КП': '#ffee58',
        'Пилот': '#4caf50',
        'Выделение финансирования': '#26c6da',
        'Закупка/торги': '#42a5f5',
        'Заключение Д Д': '#5c6bc0',
        'Заключение РД': '#7e57c2',
        'Реализация': '#ec407a',
        'Успех': '#66bb6a'
    };
    return colors[stage] || '#cccccc';
};

export default HeadOfDepartmentDashboard;