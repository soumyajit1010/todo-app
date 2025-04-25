let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let sortNewest = true;

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatTimestamp(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'pending') return !task.completed;
        return true;
    });

    filteredTasks.sort((a, b) => {
        return sortNewest ?
            new Date(b.createdAt) - new Date(a.createdAt) :
            new Date(a.createdAt) - new Date(b.createdAt);
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <span class="task-timestamp">${formatTimestamp(task.createdAt)}</span>
            <button class="complete-btn" onclick="toggleComplete(${index})">
                ${task.completed ? 'Undo' : 'Complete'}
            </button>
            <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (!text) {
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 300);
        return;
    }

    tasks.push({
        text,
        completed: false,
        createdAt: new Date().toISOString()
    });
    
    input.value = '';
    saveTasks();
    renderTasks();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function filterTasks(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(filter)) {
            btn.classList.add('active');
        }
    });
    renderTasks();
}

function sortTasks() {
    sortNewest = !sortNewest;
    document.querySelector('.sort').textContent = `Sort by ${sortNewest ? 'Newest' : 'Oldest'}`;
    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}


document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    document.querySelector('.all').classList.add('active');
});