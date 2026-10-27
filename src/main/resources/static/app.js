const API_BASE = '/api/tasks';
const form = document.getElementById('task-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-edit');
const tasksList = document.getElementById('tasks-list');
const taskIdInput = document.getElementById('task-id');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');

let editingId = null;

// Fetch all tasks
async function fetchTasks() {
    try {
        tasksList.innerHTML = '<p class="loading">Loading tasks...</p>';
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const tasks = await res.json();

        if (tasks.length === 0) {
            tasksList.innerHTML = '<p class="loading">No tasks yet. Add one below!</p>';
            return;
        }

        tasksList.innerHTML = tasks.map(task => `
            <div class="task-item" data-id="${task.id}">
                <div class="task-content">
                    <h3>${escapeHtml(task.title)}</h3>
                    <p>${escapeHtml(task.description || '')}</p>
                    <div class="task-meta">Created: ${new Date(task.createdAt).toLocaleString()}</div>
                </div>
                <div class="task-actions">
                    <button class="btn-secondary" onclick="editTask(${task.id})">Edit</button>
                    <button class="btn-danger" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        showMessage('Failed to load tasks: ' + err.message, 'error');
    }
}

// Create a new task
async function createTask(title, description) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, description})
    });
    if (!res.ok) throw new Error('Failed to create task');
    return await res.json();
}

// Update an existing task
async function updateTask(id, title, description) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, description})
    });
    if (!res.ok) throw new Error('Failed to update task');
    return await res.json();
}

// Delete a task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
        const res = await fetch(`${API_BASE}/${id}`, {method: 'DELETE'});
        if (!res.ok) throw new Error('Failed to delete task');
        await fetchTasks();
        showMessage('Task deleted successfully', 'success');
    } catch (err) {
        showMessage('Failed to delete task: ' + err.message, 'error');
    }
}

// Edit a task - load into form
function editTask(id) {
    const item = document.querySelector(`[data-id="${id}"]`);
    const title = item.querySelector('h3').textContent;
    const description = item.querySelector('p').textContent;

    taskIdInput.value = id;
    titleInput.value = title;
    descInput.value = description;
    formTitle.textContent = 'Edit Task';
    submitBtn.textContent = 'Update Task';
    cancelBtn.style.display = 'inline-block';
    editingId = id;
}

// Cancel editing
function cancelEdit() {
    taskIdInput.value = '';
    titleInput.value = '';
    descInput.value = '';
    formTitle.textContent = 'Add New Task';
    submitBtn.textContent = 'Add Task';
    cancelBtn.style.display = 'none';
    editingId = null;
}

// Show message
function showMessage(text, type) {
    const existing = document.querySelector('.message');
    if (existing) existing.remove();
    const msg = document.createElement('div');
    msg.className = 'message ' + type;
    msg.textContent = text;
    form.parentNode.insertBefore(msg, form);
    setTimeout(() => msg.remove(), 4000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Form submit handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const description = descInput.value.trim();

    if (!title) {
        showMessage('Title is required', 'error');
        return;
    }

    try {
        if (editingId) {
            await updateTask(editingId, title, description);
            showMessage('Task updated successfully', 'success');
            cancelEdit();
        } else {
            await createTask(title, description);
            showMessage('Task created successfully', 'success');
            titleInput.value = '';
            descInput.value = '';
        }
        await fetchTasks();
    } catch (err) {
        showMessage(err.message, 'error');
    }
});

cancelBtn.addEventListener('click', cancelEdit);

// Initial load
fetchTasks();
