// DOM Elements
const timerDisplay = document.querySelector('.timer-display');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start-timer');
const pauseButton = document.getElementById('pause-timer');
const resetButton = document.getElementById('reset-timer');
const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel = document.getElementById('settings-panel');
const saveSettingsButton = document.getElementById('save-settings');
const themeToggle = document.getElementById('theme-toggle');
const timerTab = document.getElementById('timer-tab');
const historyTab = document.getElementById('history-tab');
const examsTab = document.getElementById('exams-tab');
const addExamButton = document.getElementById('add-exam');
const examModal = document.getElementById('exam-modal');
const examForm = document.getElementById('exam-form');
const cancelExamButton = document.getElementById('cancel-exam');
const motivationQuote = document.getElementById('motivation-quote');

// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Timer State
let timer = {
    minutes: 25,
    seconds: 0,
    isRunning: false,
    isPaused: false,
    interval: null,
    currentMode: 'work', // work, shortBreak, longBreak
    completedSessions: 0
};

// Settings State
let settings = {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    soundEnabled: true,
    theme: 'light'
};

// Motivation Quotes
const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The future depends on what you do today. - Mahatma Gandhi",
    "It always seems impossible until it's done. - Nelson Mandela",
    "Focus on being productive instead of busy. - Tim Ferriss",
    "The only limit to the height of your achievements is the reach of your dreams and your willingness to work for them. - Michelle Obama",
    "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
    "The way to get started is to quit talking and begin doing. - Walt Disney",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
    "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "The journey of a thousand miles begins with one step. - Lao Tzu",
    "Don't count the days, make the days count. - Muhammad Ali"
];

// Load settings from API
async function loadSettings() {
    try {
        const response = await fetch(`${API_BASE_URL}/settings`);
        if (response.ok) {
            const data = await response.json();
            settings = data;
            
            // Apply settings
            document.getElementById('work-duration').value = settings.workDuration;
            document.getElementById('short-break').value = settings.shortBreak;
            document.getElementById('long-break').value = settings.longBreak;
            document.getElementById('sound-toggle').checked = settings.soundEnabled;
            
            // Apply theme
            if (settings.theme === 'dark') {
                document.body.classList.add('dark-mode');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
            
            // Update timer if not running
            if (!timer.isRunning) {
                timer.minutes = settings.workDuration;
                timer.seconds = 0;
                updateTimerDisplay();
            }
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Save settings to API
async function saveSettings() {
    try {
        const updatedSettings = {
            workDuration: parseInt(document.getElementById('work-duration').value),
            shortBreak: parseInt(document.getElementById('short-break').value),
            longBreak: parseInt(document.getElementById('long-break').value),
            soundEnabled: document.getElementById('sound-toggle').checked,
            theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light'
        };
        
        const response = await fetch(`${API_BASE_URL}/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedSettings)
        });
        
        if (response.ok) {
            settings = updatedSettings;
            
            // Update timer if not running
            if (!timer.isRunning) {
                timer.minutes = settings.workDuration;
                timer.seconds = 0;
                updateTimerDisplay();
            }
            
            // Hide settings panel
            settingsPanel.classList.remove('active');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

// Timer Functions
function updateTimerDisplay() {
    minutesDisplay.textContent = String(timer.minutes).padStart(2, '0');
    secondsDisplay.textContent = String(timer.seconds).padStart(2, '0');
}

function startTimer() {
    if (!timer.isRunning) {
        timer.isRunning = true;
        startButton.disabled = true;
        pauseButton.disabled = false;
        
        // Add animation class
        timerDisplay.classList.add('running');
        
        timer.interval = setInterval(() => {
            if (timer.seconds === 0) {
                if (timer.minutes === 0) {
                    handleTimerComplete();
                } else {
                    timer.minutes--;
                    timer.seconds = 59;
                }
            } else {
                timer.seconds--;
            }
            updateTimerDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    if (timer.isRunning) {
        clearInterval(timer.interval);
        timer.isRunning = false;
        timer.isPaused = true;
        startButton.disabled = false;
        pauseButton.disabled = true;
        
        // Remove animation class
        timerDisplay.classList.remove('running');
    }
}

function resetTimer() {
    clearInterval(timer.interval);
    timer.isRunning = false;
    timer.isPaused = false;
    timer.minutes = settings[timer.currentMode === 'work' ? 'workDuration' : 
                            timer.currentMode === 'shortBreak' ? 'shortBreak' : 'longBreak'];
    timer.seconds = 0;
    startButton.disabled = false;
    pauseButton.disabled = true;
    
    // Remove animation class
    timerDisplay.classList.remove('running');
    
    updateTimerDisplay();
}

function handleTimerComplete() {
    clearInterval(timer.interval);
    timer.isRunning = false;
    startButton.disabled = false;
    pauseButton.disabled = true;
    
    // Remove animation class
    timerDisplay.classList.remove('running');

    if (settings.soundEnabled) {
        playNotificationSound();
    }

    if (timer.currentMode === 'work') {
        timer.completedSessions++;
        saveSession();
        
        if (timer.completedSessions % 4 === 0) {
            timer.currentMode = 'longBreak';
            timer.minutes = settings.longBreak;
        } else {
            timer.currentMode = 'shortBreak';
            timer.minutes = settings.shortBreak;
        }
    } else {
        timer.currentMode = 'work';
        timer.minutes = settings.workDuration;
    }

    timer.seconds = 0;
    updateTimerDisplay();
    
    // Update motivation quote
    updateMotivationQuote();
}

function playNotificationSound() {
    const audio = new Audio('assets/sounds/notification.mp3');
    audio.play().catch(error => console.log('Error playing sound:', error));
}

// Motivation Quote Functions
function updateMotivationQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    motivationQuote.textContent = quotes[randomIndex];
    motivationQuote.style.opacity = '0';
    
    setTimeout(() => {
        motivationQuote.style.opacity = '1';
    }, 100);
}

// Session Management
async function saveSession() {
    try {
        const session = {
            date: new Date().toISOString(),
            duration: settings.workDuration,
            mode: timer.currentMode,
            notes: ''
        };
        
        const response = await fetch(`${API_BASE_URL}/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(session)
        });
        
        if (response.ok) {
            updateSessionHistory();
        }
    } catch (error) {
        console.error('Error saving session:', error);
    }
}

async function loadSessionHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions`);
        if (response.ok) {
            const sessions = await response.json();
            updateSessionHistoryUI(sessions);
        }
    } catch (error) {
        console.error('Error loading session history:', error);
    }
}

function updateSessionHistoryUI(sessions) {
    const sessionList = document.getElementById('session-list');
    sessionList.innerHTML = '';
    
    sessions.forEach(session => {
        const sessionElement = document.createElement('div');
        sessionElement.className = 'session-item';
        sessionElement.innerHTML = `
            <div>
                <strong>${new Date(session.date).toLocaleDateString()}</strong>
                <span>${session.duration} minutes - ${session.mode}</span>
            </div>
        `;
        sessionList.appendChild(sessionElement);
    });
}

// Exam Management
function showExamModal() {
    examModal.classList.remove('hidden');
}

function hideExamModal() {
    examModal.classList.add('hidden');
    examForm.reset();
}

async function saveExam(event) {
    event.preventDefault();
    
    try {
        const exam = {
            subject: document.getElementById('subject-name').value,
            code: document.getElementById('subject-code').value,
            date: document.getElementById('exam-date').value,
            time: document.getElementById('exam-time').value,
            completed: false
        };
        
        const response = await fetch(`${API_BASE_URL}/exams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(exam)
        });
        
        if (response.ok) {
            loadExams();
            hideExamModal();
        }
    } catch (error) {
        console.error('Error saving exam:', error);
    }
}

async function loadExams() {
    try {
        const response = await fetch(`${API_BASE_URL}/exams`);
        if (response.ok) {
            const exams = await response.json();
            updateExamList(exams);
        }
    } catch (error) {
        console.error('Error loading exams:', error);
    }
}

function updateExamList(exams) {
    const examList = document.getElementById('exam-list');
    examList.innerHTML = '';
    
    // Sort exams: incomplete exams by date (nearest first), then completed exams
    const sortedExams = exams.sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        if (a.completed && b.completed) return 0;
        return new Date(a.date) - new Date(b.date);
    });

    sortedExams.forEach(exam => {
        const examItem = document.createElement('div');
        examItem.className = `exam-item ${exam.completed ? 'completed' : ''}`;
        
        const daysLeft = Math.ceil((new Date(exam.date) - new Date()) / (1000 * 60 * 60 * 24));
        const daysLeftText = daysLeft > 0 ? `${daysLeft} days left` : 'Today';
        
        examItem.innerHTML = `
            <div class="exam-info">
                <h3>${exam.subject}</h3>
                <p>${exam.code}</p>
                <p class="days-left">${daysLeftText}</p>
            </div>
            <button class="complete-btn" onclick="toggleExamCompletion('${exam.id}')">
                ${exam.completed ? '✓' : '○'}
            </button>
        `;
        
        examList.appendChild(examItem);
    });
}

async function toggleExamCompletion(examId) {
    try {
        const response = await fetch(`${API_BASE_URL}/exams/${examId}/toggle`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            await loadExams(); // Reload the exam list to get the updated state
        }
    } catch (error) {
        console.error('Error toggling exam completion:', error);
    }
}

async function deleteExam(examId) {
    try {
        const response = await fetch(`${API_BASE_URL}/exams/${examId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadExams();
        }
    } catch (error) {
        console.error('Error deleting exam:', error);
    }
}

// Settings Management
function toggleSettings() {
    settingsPanel.classList.toggle('active');
}

// Theme Management
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    saveSettings();
}

// Tab Management
function switchTab(tabId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-links button').forEach(button => {
        button.classList.remove('active');
    });
    
    document.getElementById(`${tabId}-section`).classList.add('active');
    document.getElementById(`${tabId}-tab`).classList.add('active');
    
    if (tabId === 'history') {
        loadSessionHistory();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadExams();
    loadSessionHistory();
    updateMotivationQuote();
});

settingsToggle.addEventListener('click', toggleSettings);
saveSettingsButton.addEventListener('click', saveSettings);
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
themeToggle.addEventListener('click', toggleTheme);
timerTab.addEventListener('click', () => switchTab('timer'));
historyTab.addEventListener('click', () => switchTab('history'));
addExamButton.addEventListener('click', showExamModal);
cancelExamButton.addEventListener('click', hideExamModal);
examForm.addEventListener('submit', saveExam);

// Initialize 