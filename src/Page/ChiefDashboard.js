import React, { useState, useEffect } from 'react';
import './ChiefDashboard.css';

const ChiefDashboard = () => {
    const [activeTab, setActiveTab] = useState('reports');
    const [departments, setDepartments] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [projects, setProjects] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assigned_department: '',
        deadline: '',
        priority: 'medium'
    });
    const [loading, setLoading] = useState(false);

    // Конфигурация подключения к БД
    const API_BASE_URL = 'http://localhost:5000/api'; // Замените на ваш URL сервера

    // Функции для работы с API
    const fetchData = async (endpoint) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`);
            if (!response.ok) throw new Error('Ошибка загрузки данных');
            return await response.json();
        } catch (error) {
            console.error(`Ошибка загрузки ${endpoint}:`, error);
            return [];
        }
    };

    const postData = async (endpoint, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Ошибка сохранения данных');
            return await response.json();
        } catch (error) {
            console.error(`Ошибка сохранения ${endpoint}:`, error);
            throw error;
        }
    };

    // Загрузка данных при монтировании компонента
    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [deptsData, tasksData, empsData, projsData] = await Promise.all([
                fetchData('departments'),
                fetchData('tasks'),
                fetchData('employees'),
                fetchData('projects')
            ]);

            setDepartments(deptsData);
            setTasks(tasksData);
            setEmployees(empsData);
            setProjects(projsData);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            setLoading(false);
        }
    };

    // Функция для создания нового задания
    const handleCreateTask = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const createdTask = await postData('tasks', {
                ...newTask,
                created_at: new Date().toISOString(),
                status: 'assigned',
                created_by: 'chief' // В реальности ID начальника из сессии
            });

            setTasks(prev => [...prev, createdTask]);
            setNewTask({
                title: '',
                description: '',
                assigned_department: '',
                deadline: '',
                priority: 'medium'
            });
            alert('Задание успешно создано!');
        } catch (error) {
            alert('Ошибка при создании задания');
        } finally {
            setLoading(false);
        }
    };

    // Функция для обновления статуса задания
    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await postData(`tasks/${taskId}`, { status: newStatus });
            setTasks(prev => prev.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            ));
        } catch (error) {
            console.error('Ошибка обновления статуса:', error);
        }
    };

    // Расчет статистики по отделам
    const calculateDepartmentStats = () => {
        return departments.map(dept => {
            const deptEmployees = employees.filter(emp => emp.department_id === dept.id);
            const deptProjects = projects.filter(proj => proj.department_id === dept.id);
            const deptTasks = tasks.filter(task => task.assigned_department === dept.id);

            const completedProjects = deptProjects.filter(proj => proj.status === 'completed').length;
            const activeTasks = deptTasks.filter(task => task.status === 'in_progress').length;
            const completedTasks = deptTasks.filter(task => task.status === 'completed').length;

            const totalRevenue = deptProjects.reduce((sum, proj) => sum + (proj.revenue || 0), 0);
            const totalCosts = deptProjects.reduce((sum, proj) => sum + (proj.costs || 0), 0);
            const efficiency = totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue * 100) : 0;

            return {
                ...dept,
                employeeCount: deptEmployees.length,
                projectCount: deptProjects.length,
                completedProjects,
                activeTasks,
                completedTasks,
                totalRevenue,
                totalCosts,
                efficiency: Math.round(efficiency)
            };
        });
    };

    const departmentStats = calculateDepartmentStats();

    return (
        <div className="chief-dashboard">
            <header className="dashboard-header">
                <h1>Панель управления начальника</h1>
                <div className="user-info">
                    <span>Начальник: Сергеев С.С.</span>
                    <button onClick={loadAllData} className="refresh-btn" disabled={loading}>
                        {loading ? 'Обновление...' : 'Обновить данные'}
                    </button>
                </div>
            </header>

            <nav className="chief-nav">
                <button
                    className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                >
                    Сводные отчёты
                </button>
                <button
                    className={`nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tasks')}
                >
                    Управление заданиями
                </button>
            </nav>

            <main className="dashboard-main">
                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner">Загрузка данных...</div>
                    </div>
                )}

                {/* Вкладка Сводные отчёты */}
                {activeTab === 'reports' && (
                    <div className="reports-tab">
                        <h2>Сводные отчёты по отделам</h2>

                        <div className="summary-cards">
                            <div className="summary-card total">
                                <h3>Общая статистика</h3>
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <span className="stat-value">{departments.length}</span>
                                        <span className="stat-label">Отделов</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-value">{employees.length}</span>
                                        <span className="stat-label">Сотрудников</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-value">{projects.length}</span>
                                        <span className="stat-label">Проектов</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-value">{tasks.length}</span>
                                        <span className="stat-label">Заданий</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="departments-grid">
                            {departmentStats.map(dept => (
                                <div key={dept.id} className="department-card">
                                    <div className="department-header">
                                        <h3>{dept.name}</h3>
                                        <span className={`efficiency-badge efficiency-${Math.floor(dept.efficiency / 20)}`}>
                                            {dept.efficiency}%
                                        </span>
                                    </div>

                                    <div className="department-stats">
                                        <div className="stat-row">
                                            <span>Сотрудников:</span>
                                            <strong>{dept.employeeCount}</strong>
                                        </div>
                                        <div className="stat-row">
                                            <span>Проектов:</span>
                                            <strong>{dept.projectCount} ({dept.completedProjects} завершено)</strong>
                                        </div>
                                        <div className="stat-row">
                                            <span>Задания:</span>
                                            <strong>{dept.activeTasks} активных, {dept.completedTasks} выполнено</strong>
                                        </div>
                                        <div className="stat-row">
                                            <span>Выручка:</span>
                                            <strong>{dept.totalRevenue.toLocaleString()} ₽</strong>
                                        </div>
                                        <div className="stat-row">
                                            <span>Затраты:</span>
                                            <strong>{dept.totalCosts.toLocaleString()} ₽</strong>
                                        </div>
                                    </div>

                                    <div className="progress-bars">
                                        <div className="progress-item">
                                            <label>Загрузка отдела</label>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{width: `${Math.min((dept.activeTasks / Math.max(dept.employeeCount, 1)) * 50, 100)}%`}}
                                                ></div>
                                            </div>
                                            <span>{Math.round((dept.activeTasks / Math.max(dept.employeeCount, 1)) * 50)}%</span>
                                        </div>
                                        <div className="progress-item">
                                            <label>Эффективность</label>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill efficiency"
                                                    style={{width: `${dept.efficiency}%`}}
                                                ></div>
                                            </div>
                                            <span>{dept.efficiency}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Графики эффективности */}
                        <div className="charts-section">
                            <div className="chart-card">
                                <h4>Эффективность отделов</h4>
                                <div className="efficiency-chart">
                                    {departmentStats.map(dept => (
                                        <div key={dept.id} className="chart-bar">
                                            <div className="bar-label">{dept.name}</div>
                                            <div className="bar-container">
                                                <div
                                                    className="bar-fill"
                                                    style={{width: `${dept.efficiency}%`}}
                                                    title={`Эффективность: ${dept.efficiency}%`}
                                                >
                                                    <span className="bar-value">{dept.efficiency}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Вкладка Управление заданиями */}
                {activeTab === 'tasks' && (
                    <div className="tasks-tab">
                        <div className="tasks-container">
                            <div className="create-task-section">
                                <h3>Создать новое задание</h3>
                                <form onSubmit={handleCreateTask} className="task-form">
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Название задания *</label>
                                            <input
                                                type="text"
                                                value={newTask.title}
                                                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>Отдел *</label>
                                            <select
                                                value={newTask.assigned_department}
                                                onChange={(e) => setNewTask({...newTask, assigned_department: e.target.value})}
                                                required
                                            >
                                                <option value="">Выберите отдел</option>
                                                {departments.map(dept => (
                                                    <option key={dept.id} value={dept.id}>
                                                        {dept.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-field">
                                            <label>Приоритет</label>
                                            <select
                                                value={newTask.priority}
                                                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                                            >
                                                <option value="low">Низкий</option>
                                                <option value="medium">Средний</option>
                                                <option value="high">Высокий</option>
                                            </select>
                                        </div>
                                        <div className="form-field">
                                            <label>Срок выполнения *</label>
                                            <input
                                                type="date"
                                                value={newTask.deadline}
                                                onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-field full-width">
                                        <label>Описание задания</label>
                                        <textarea
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                            rows="4"
                                            placeholder="Подробное описание задания..."
                                        />
                                    </div>

                                    <button type="submit" className="create-task-btn" disabled={loading}>
                                        {loading ? 'Создание...' : 'Создать задание'}
                                    </button>
                                </form>
                            </div>

                            <div className="tasks-list-section">
                                <h3>Активные задания</h3>
                                <div className="tasks-list">
                                    {tasks.filter(task => task.status !== 'completed').map(task => {
                                        const department = departments.find(dept => dept.id === task.assigned_department);
                                        return (
                                            <div key={task.id} className={`task-card priority-${task.priority}`}>
                                                <div className="task-header">
                                                    <h4>{task.title}</h4>
                                                    <div className="task-meta">
                                                        <span className={`priority-badge ${task.priority}`}>
                                                            {task.priority === 'high' ? 'Высокий' :
                                                                task.priority === 'medium' ? 'Средний' : 'Низкий'}
                                                        </span>
                                                        <span className="department-badge">
                                                            {department?.name || 'Неизвестный отдел'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="task-description">{task.description}</p>

                                                <div className="task-footer">
                                                    <div className="task-dates">
                                                        <span>Создано: {new Date(task.created_at).toLocaleDateString()}</span>
                                                        <span>Срок: {new Date(task.deadline).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="task-actions">
                                                        <select
                                                            value={task.status}
                                                            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                                            className="status-select"
                                                        >
                                                            <option value="assigned">Назначено</option>
                                                            <option value="in_progress">В работе</option>
                                                            <option value="completed">Завершено</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ChiefDashboard;