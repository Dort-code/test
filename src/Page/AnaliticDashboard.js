import React, { useState, useEffect } from 'react';
import './AnaliticDashboard.css';

const AnaliticDashboard = () => {
    const [activeTab, setActiveTab] = useState('employees');
    const [employees, setEmployees] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [editingProject, setEditingProject] = useState(null); // Новое состояние для редактирования

    // Моковые данные сотрудников
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
            id: 3,
            name: 'Сидорова Мария Сергеевна',
            position: 'Менеджер по развитию',
            department: 'Отдел маркетинга',
            efficiency: 78,
            completedProjects: 8,
            currentProjects: 4,
            revenue: 3200000,
            costs: 900000
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
            costs: 1100000
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

    useEffect(() => {
        // Загрузка данных сотрудников и проектов
        setEmployees(mockEmployees);
        setProjects(mockProjects);
    }, []);

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
                <h1>Панель управления начальника отдела</h1>
                <div className="user-info">
                    <span>Начальник отдела: Сергеев С.С.</span>
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
                        <h2>Редактирование карточек проектов</h2>
                        <div className="projects-list">
                            {projects.map(project => (
                                <div key={project.id} className="project-management-card">
                                    <div className="project-main-info">
                                        <h3>{project.projectName}</h3>
                                        <p><strong>Организация:</strong> {project.organizationName}</p>
                                        <p><strong>Менеджер:</strong> {project.manager}</p>
                                        <p><strong>Этап:</strong> {project.projectStage}</p>
                                        <p><strong>Вероятность:</strong> {project.implementationProbability}%</p>
                                    </div>
                                    <div className="project-finance">
                                        <p><strong>Выручка:</strong> {project.revenue.reduce((sum, r) => sum + r.amount, 0).toLocaleString()} ₽</p>
                                        <p><strong>Затраты:</strong> {project.costs.reduce((sum, c) => sum + c.amount, 0).toLocaleString()} ₽</p>
                                    </div>
                                    <div className="project-actions">
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => editProject(project)}
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            className="action-btn analyze-btn"
                                            onClick={() => loadProjectForAnalysis(project)}
                                        >
                                            Анализировать
                                        </button>
                                    </div>
                                </div>
                            ))}
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

export default AnaliticDashboard;