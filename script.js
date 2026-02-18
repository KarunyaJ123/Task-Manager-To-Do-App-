const addBtn = document.getElementById("addBtn");
const titleInput = document.getElementById("titleInput");
const descInput = document.getElementById("descInput");
const dateInput = document.getElementById("dateInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const noResultMessage = document.getElementById("noResultMessage");

document.addEventListener("DOMContentLoaded", loadTasks);
addBtn.addEventListener("click", addTask);
searchInput.addEventListener("input", searchTasks);

function addTask() {
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const dueDate = dateInput.value;

    if (!title || !dueDate) {
        alert("Title and Due Date are required!");
        return;
    }

    const task = {
        id: Date.now(),
        title,
        description,
        dueDate
    };

    saveTask(task);
    renderTask(task);

    titleInput.value = "";
    descInput.value = "";
    dateInput.value = "";
}

function renderTask(task) {
    const li = document.createElement("li");
    li.dataset.id = task.id;

    const today = new Date().toISOString().split("T")[0];
    const isOverdue = task.dueDate < today;

    li.innerHTML = `
        <div class="task-header">
            <strong>${task.title}</strong>
            <span class="status ${isOverdue ? "overdue" : "pending"}">
                ${isOverdue ? "Overdue" : "Pending"}
            </span>
        </div>
        <div>${task.description}</div>
        <div>Due: ${task.dueDate}</div>
        <div class="task-buttons">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    li.querySelector(".delete-btn").addEventListener("click", () => {
        deleteTask(task.id);
        li.remove();
    });

    li.querySelector(".edit-btn").addEventListener("click", () => {
        editTask(task);
    });

    taskList.appendChild(li);
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => renderTask(task));
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function editTask(task) {
    titleInput.value = task.title;
    descInput.value = task.description;
    dateInput.value = task.dueDate;

    deleteTask(task.id);
    document.querySelector(`[data-id="${task.id}"]`).remove();
}

function searchTasks() {
    const keyword = searchInput.value.toLowerCase();
    const items = document.querySelectorAll("#taskList li");

    let matchFound = false;

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(keyword)) {
            item.style.display = "block";
            matchFound = true;
        } else {
            item.style.display = "none";
        }
    });

    if (!matchFound && keyword !== "") {
        noResultMessage.textContent = "No matching tasks found";
    } else {
        noResultMessage.textContent = "";
    }
}