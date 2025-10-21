import React, { useState, useEffect } from 'react';
import '../App.css';

export function AdminPA({ onLogout }) {
    const [activeTab, setActiveTab] = useState('statistics');
    const [notifications, setNotifications] = useState([]);
    const [workers, setWorkers] = useState([
        { id: 1, name: 'Иван Петров', position: 'Оператор', efficiency: 85, messages: 3 },
        { id: 2, name: 'Мария Сидорова', position: 'Контролёр', efficiency: 92, messages: 1 },
        { id: 3, name: 'Алексей Козлов', position: 'Техник', efficiency: 78, messages: 5 }
    ]);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [messages, setMessages] = useState({});
    const [newMessage, setNewMessage] = useState('');

    // Имитация получения уведомлений
    useEffect(() => {
        const interval = setInterval(() => {
            const randomWorker = workers[Math.floor(Math.random() * workers.length)];
            if (Math.random() > 0.7) {
                const notification = {
                    id: Date.now(),
                    worker: randomWorker.name,
                    message: 'Новое сообщение от рабочего',
                    time: new Date().toLocaleTimeString()
                };
                setNotifications(prev => [notification, ...prev.slice(0, 4)]);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [workers]);

    const handleSendMessage = (workerId) => {
        if (newMessage.trim()) {
            const worker = workers.find(w => w.id === workerId);
            const message = {
                id: Date.now(),
                text: newMessage,
                sender: 'admin',
                time: new Date().toLocaleTimeString()
            };
            
            setMessages(prev => ({
                ...prev,
                [workerId]: [...(prev[workerId] || []), message]
            }));
            setNewMessage('');
        }
    };

    const renderStatistics = () => (
        <div className="statistics-content">
            <h3>Статистика эффективности</h3>
            <div className="charts-container">
                <div className="chart-section">
                    <h4>Общая эффективность за месяц</h4>
                    <div className="bar-chart">
                        {workers.map(worker => (
                            <div key={worker.id} className="bar-item">
                                <div className="bar-label">{worker.name}</div>
                                <div className="bar-container">
                                    <div 
                                        className="bar-fill" 
                                        style={{ width: `${worker.efficiency}%` }}
                                    ></div>
                                </div>
                                <div className="bar-value">{worker.efficiency}%</div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="chart-section">
                    <h4>Динамика за неделю</h4>
                    <div className="line-chart">
                        <div className="chart-grid">
                            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
                                <div key={day} className="grid-item">
                                    <div className="day-label">{day}</div>
                                    <div 
                                        className="efficiency-dot" 
                                        style={{ 
                                            height: `${Math.random() * 40 + 60}px`,
                                            backgroundColor: `hsl(${120 + Math.random() * 60}, 70%, 50%)`
                                        }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderReports = () => (
        <div className="reports-content">
            <h3>Формирование отчётов</h3>
            <div className="report-form">
                <div className="form-group">
                    <label>Период отчёта:</label>
                    <div className="date-range">
                        <input type="date" />
                        <span>до</span>
                        <input type="date" />
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Тип отчёта:</label>
                    <select>
                        <option>Общая эффективность</option>
                        <option>Детализированный по рабочим</option>
                        <option>Сравнительный анализ</option>
                        <option>Отчёт по задачам</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Включить данные:</label>
                    <div className="checkbox-group">
                        <label><input type="checkbox" defaultChecked /> Эффективность</label>
                        <label><input type="checkbox" defaultChecked /> Выполненные задачи</label>
                        <label><input type="checkbox" /> Время работы</label>
                        <label><input type="checkbox" /> Ошибки и замечания</label>
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Формат экспорта:</label>
                    <select>
                        <option>PDF</option>
                        <option>Excel</option>
                        <option>CSV</option>
                    </select>
                </div>
                
                <button className="generate-report-btn">Сформировать отчёт</button>
            </div>
        </div>
    );

    const renderWorkers = () => (
        <div className="workers-content">
            <h3>Управление рабочими</h3>
            <div className="workers-layout">
                <div className="workers-list">
                    <h4>Список рабочих</h4>
                    {workers.map(worker => (
                        <div 
                            key={worker.id} 
                            className={`worker-card ${selectedWorker?.id === worker.id ? 'selected' : ''}`}
                            onClick={() => setSelectedWorker(worker)}
                        >
                            <div className="worker-info">
                                <h5>{worker.name}</h5>
                                <p>{worker.position}</p>
                                <div className="efficiency-indicator">
                                    <span>Эффективность: {worker.efficiency}%</span>
                                    <div className="efficiency-bar">
                                        <div 
                                            className="efficiency-fill" 
                                            style={{ width: `${worker.efficiency}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            {worker.messages > 0 && (
                                <div className="message-badge">{worker.messages}</div>
                            )}
                        </div>
                    ))}
                </div>
                
                {selectedWorker && (
                    <div className="worker-details">
                        <h4>Информация о рабочем</h4>
                        <div className="worker-profile">
                            <h5>{selectedWorker.name}</h5>
                            <p><strong>Должность:</strong> {selectedWorker.position}</p>
                            <p><strong>ID:</strong> {selectedWorker.id}</p>
                            
                            <div className="worker-stats">
                                <h6>Статистика эффективности</h6>
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <span>Текущая эффективность</span>
                                        <span className="stat-value">{selectedWorker.efficiency}%</span>
                                    </div>
                                    <div className="stat-item">
                                        <span>Задач выполнено</span>
                                        <span className="stat-value">24</span>
                                    </div>
                                    <div className="stat-item">
                                        <span>Среднее время</span>
                                        <span className="stat-value">2.5ч</span>
                                    </div>
                                </div>
                                
                                <div className="worker-chart">
                                    <h6>График эффективности</h6>
                                    <div className="mini-chart">
                                        {Array.from({length: 7}, (_, i) => (
                                            <div key={i} className="chart-bar">
                                                <div 
                                                    className="chart-bar-fill"
                                                    style={{ 
                                                        height: `${Math.random() * 60 + 40}%`,
                                                        backgroundColor: `hsl(${120 + Math.random() * 60}, 70%, 50%)`
                                                    }}
                                                ></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderMessages = () => (
        <div className="messages-content">
            <h3>Сообщения</h3>
            <div className="messages-layout">
                <div className="workers-chat-list">
                    <h4>Рабочие</h4>
                    {workers.map(worker => (
                        <div 
                            key={worker.id} 
                            className={`chat-worker-item ${selectedWorker?.id === worker.id ? 'active' : ''}`}
                            onClick={() => setSelectedWorker(worker)}
                        >
                            <div className="worker-avatar">
                                {worker.name.charAt(0)}
                            </div>
                            <div className="worker-chat-info">
                                <h5>{worker.name}</h5>
                                <p>{worker.position}</p>
                            </div>
                            {worker.messages > 0 && (
                                <div className="unread-badge">{worker.messages}</div>
                            )}
                        </div>
                    ))}
                </div>
                
                {selectedWorker && (
                    <div className="chat-container">
                        <div className="chat-header">
                            <h4>Чат с {selectedWorker.name}</h4>
                        </div>
                        
                        <div className="chat-messages">
                            {messages[selectedWorker.id]?.map(message => (
                                <div key={message.id} className={`message ${message.sender}`}>
                                    <div className="message-content">
                                        {message.text}
                                    </div>
                                    <div className="message-time">{message.time}</div>
                                </div>
                            )) || (
                                <div className="no-messages">Нет сообщений</div>
                            )}
                        </div>
                        
                        <div className="chat-input">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Введите сообщение..."
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(selectedWorker.id)}
                            />
                            <button onClick={() => handleSendMessage(selectedWorker.id)}>
                                Отправить
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h2>Админ-панель</h2>
                <div className="header-actions">
                    <div className="notifications">
                        {notifications.length > 0 && (
                            <div className="notification-bell">
                                🔔
                                <div className="notification-count">{notifications.length}</div>
                            </div>
                        )}
                    </div>
                    <button onClick={onLogout} className="logout-btn">Выйти</button>
                </div>
            </div>
            
            <div className="admin-tabs">
                <button 
                    className={`tab ${activeTab === 'statistics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('statistics')}
                >
                    📊 Статистика
                </button>
                <button 
                    className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                >
                    📋 Отчёт
                </button>
                <button 
                    className={`tab ${activeTab === 'workers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('workers')}
                >
                    👷 Рабочий
                </button>
                <button 
                    className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
                    onClick={() => setActiveTab('messages')}
                >
                    💬 Сообщения
                    {notifications.length > 0 && (
                        <span className="tab-notification">{notifications.length}</span>
                    )}
                </button>
            </div>
            
            <div className="admin-content">
                {activeTab === 'statistics' && renderStatistics()}
                {activeTab === 'reports' && renderReports()}
                {activeTab === 'workers' && renderWorkers()}
                {activeTab === 'messages' && renderMessages()}
            </div>
            
            {notifications.length > 0 && (
                <div className="notifications-panel">
                    <h4>Уведомления</h4>
                    {notifications.map(notification => (
                        <div key={notification.id} className="notification-item">
                            <div className="notification-content">
                                <strong>{notification.worker}</strong>
                                <p>{notification.message}</p>
                                <span className="notification-time">{notification.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}