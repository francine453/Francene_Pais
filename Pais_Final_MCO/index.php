<?php include 'header.php'; ?>
<div class="container">
    <h1 class="mb-4">Task/To-do Management App</h1>
    <!-- Task entry form -->
    <form id="taskForm" class="d-flex mb-3" autocomplete="off">
        <input type="text" id="taskInput" class="form-control" placeholder="Enter new task..." required />
        <button id="addTaskBtn" type="submit" class="btn btn-primary ms-2">Add</button>
    </form>
    <!-- Sort and Filter controls -->
    <div class="controls mb-4 justify-content-center d-flex flex-wrap gap-3">
        <select id="sortSelect" class="form-select w-auto">
            <option value="created_asc">Sort by Date ↑</option>
            <option value="created_desc" selected>Sort by Date ↓</option>
            <option value="status">Sort by Status</option>
        </select>
        <select id="filterSelect" class="form-select w-auto">
            <option value="all" selected>Filter: All Tasks</option>
            <option value="done">Done</option>
            <option value="pending">Pending</option>
        </select>
    </div>
    <!-- Task list -->
    <ul id="taskList" class="list-unstyled"></ul>
</div>
<!-- Load JS -->
<script src="script.js"></script>
<?php include 'footer.php'; ?>