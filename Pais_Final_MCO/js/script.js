document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const sortSelect = document.getElementById('sortSelect');
    const filterSelect = document.getElementById('filterSelect');

    async function fetchTasks() {
        const sortBy = sortSelect.value;
        const filterBy = filterSelect.value;
        try {
            const response = await fetch(`api.php?action=list&sort=${sortBy}&filter=${filterBy}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            renderTasks(data.tasks);
        } catch (err) {
            alert('Error loading tasks: ' + err.message);
        }
    }

    function renderTasks(tasks) {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskList.innerHTML = '<li class="text-center text-muted">No tasks found.</li>';
            return;
        }
        for (const task of tasks) {
            const li = document.createElement('li');
            li.className = 'task-item' + (task.status === 'done' ? ' done' : '');
            li.dataset.id = task.id;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.status === 'done';
            checkbox.className = 'form-check-input';
            checkbox.title = 'Mark as done';
            li.appendChild(checkbox);

            const label = document.createElement('label');
            label.className = 'task-desc ms-2 flex-grow-1';
            label.textContent = task.description;
            label.title = 'Click to edit';
            li.appendChild(label);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';

            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<i class="bi bi-pencil-fill"></i>';
            editBtn.title = 'Edit task';
            editBtn.className = 'btn btn-sm btn-link text-primary';
            actionsDiv.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';
            deleteBtn.title = 'Delete task';
            deleteBtn.className = 'btn btn-sm btn-link text-danger';
            actionsDiv.appendChild(deleteBtn);

            li.appendChild(actionsDiv);

            taskList.appendChild(li);
        }
    }

    async function addTask(description) {
        try {
            if (!description.trim()) {
                alert('Please enter a task description.');
                return;
            }
            const formData = new FormData();
            formData.append('action', 'add');
            formData.append('description', description.trim());
            const response = await fetch('api.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            taskInput.value = '';
            fetchTasks();
        } catch (err) {
            alert('Error adding task: ' + err.message);
        }
    }

    async function deleteTask(id) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('id', id);
            const response = await fetch('api.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            fetchTasks();
        } catch (err) {
            alert('Error deleting task: ' + err.message);
        }
    }

    async function toggleDone(id, done) {
        try {
            const formData = new FormData();
            formData.append('action', 'update_status');
            formData.append('id', id);
            formData.append('status', done ? 'done' : 'pending');
            const response = await fetch('api.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            fetchTasks();
        } catch (err) {
            alert('Error updating task status: ' + err.message);
        }
    }

    async function updateDescription(id, newDesc) {
        if (!newDesc.trim()) {
            alert('Task description cannot be empty.');
            fetchTasks();
            return;
        }
        try {
            const formData = new FormData();
            formData.append('action', 'update');
            formData.append('id', id);
            formData.append('description', newDesc.trim());
            const response = await fetch('api.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            fetchTasks();
        } catch (err) {
            alert('Error updating task: ' + err.message);
        }
    }

    // Event delegation for task list
    taskList.addEventListener('click', (e) => {
        const li = e.target.closest('li.task-item');
        if (!li) return;
        const taskId = li.dataset.id;

        // Checkbox toggle
        if (e.target.type === 'checkbox') {
            toggleDone(taskId, e.target.checked);
            return;
        }

        // Delete button
        if (e.target.closest('button')?.classList.contains('text-danger')) {
            deleteTask(taskId);
            return;
        }

        // Edit button
        if (e.target.closest('button')?.classList.contains('text-primary')) {
            const label = li.querySelector('.task-desc');
            const currentDesc = label.textContent;

            // Replace label with input
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentDesc;
            input.className = 'form-control form-control-sm';
            li.replaceChild(input, label);
            input.focus();

            input.addEventListener('blur', () => {
                const newDesc = input.value;
                // Restore label and update value
                updateDescription(taskId, newDesc);
            });

            input.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter') {
                    input.blur();
                } else if (ev.key === 'Escape') {
                    fetchTasks();
                }
            });
            return;
        }
    });

    // Handle add task form submit
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value);
    });

    // Handle sort and filter change
    sortSelect.addEventListener('change', fetchTasks);
    filterSelect.addEventListener('change', fetchTasks);

    // Initial load
    fetchTasks();
});
