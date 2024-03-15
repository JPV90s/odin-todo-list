const addToDo = document.querySelector("#add-todo");
const toDoForm = document.querySelector("#todo-form");
const titleInput = document.querySelector("#title-input");
const priorityInput = document.querySelector("#priority-input");
const categoryInput = document.querySelector("#category-input");
const descriptionInput = document.querySelector("#description-input");
const dateInput = document.querySelector("#date-input");
const dialogToDo = document.querySelector(".dialog-todo");
const submitOrEditToDo = document.querySelector("#submit-todo");
const cancelBtn = document.querySelector("#cancel-btn");
const todoList = document.querySelector(".todo-list");

const toDoData = JSON.parse(localStorage.getItem("data")) || [];
let currentToDo = {};

addToDo.addEventListener("click", () => dialogToDo.showModal());
cancelBtn.addEventListener("click", () => dialogToDo.close());
submitOrEditToDo.addEventListener("click", () => dialogToDo.close());

const addOrUpdateToDo = () => {
  submitOrEditToDo.innerText = "Add Todo";
  const dataArrIndex = toDoData.findIndex((item) => item.id === currentToDo.id);
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    priority: priorityInput.value,
    category: categoryInput.value,
    description: descriptionInput.value,
    date: dateInput.value,
  };

  if (dataArrIndex === -1) {
    toDoData.unshift(taskObj);
  } else {
    toDoData[dataArrIndex] = taskObj;
  }

  localStorage.setItem("data", JSON.stringify(toDoData));
  updateToDoContainer();
  reset();
};

const updateToDoContainer = () => {
  todoList.innerHTML = "";

  toDoData.forEach(({ id, title, priority, category, description, date }) => {
    todoList.innerHTML += `
    <div class="${id} todo">
    <div class="left-todo">
      <input type="checkbox" />
    </div>
    <div class="middle-todo">
      <div class="top-middle">
        <p><strong>Title: </strong> <i> ${title}</i></p>
      </div>
      <div class="bottom-middle">
        <p><strong>Due date: </strong> <i> ${date}</i></p>
        <p><strong>Priority: </strong><i> ${priority}</i></p>
      </div>
    </div>
    <div class="right-todo" id="${id}">
      <button
        onclick="editToDo(this)"
        type="button"
        class="btn"
        id="edit-btn"
      >
        Edit
      </button>
      <button
        onclick="deleteToDo(this)"
        type="button"
        class="btn"
        id="delete-btn"
      >
        Delete
      </button>
    </div>
  </div>
        `;
  });
};

const deleteToDo = (buttonEl) => {
  const dataArrIndex = toDoData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  const toDoIdDelete = toDoData[dataArrIndex].id;
  const toDoElementDelete = document.querySelector(`.${toDoIdDelete}`);

  toDoElementDelete.remove();

  toDoData.splice(dataArrIndex, 1);
  localStorage.setItem("data", JSON.stringify(toDoData));
};

const editToDo = (buttonEl) => {
  const dataArrIndex = toDoData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  currentToDo = toDoData[dataArrIndex];

  titleInput.value = currentToDo.title;
  priorityInput.value = currentToDo.priority;
  categoryInput.value = currentToDo.category;
  descriptionInput.value = currentToDo.description;
  dateInput.value = currentToDo.date;

  submitOrEditToDo.innerText = "Update Task";
  dialogToDo.showModal();
};

const reset = () => {
  titleInput.value = "";
  priorityInput.value = "";
  categoryInput.value = "";
  descriptionInput.value = "";
  dateInput.value = "";
  currentTask = {};
};

if (toDoData.length) {
  updateToDoContainer();
}

toDoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addOrUpdateToDo();
});

// Function to filter to-dos by category
const filterToDosByCategory = (category) => {
  // Clear the current to-do list display
  todoList.innerHTML = "";

  // Filter the toDoData array by the given category
  const filteredToDos = toDoData.filter((todo) => todo.category === category);

  // Iterate over the filtered to-dos and add them to the display
  filteredToDos.forEach(
    ({ id, title, priority, category, description, date }) => {
      todoList.innerHTML += `
      <div class="todo ${id}">
        <div class="left-todo">
          <input type="checkbox" />
        </div>
        <div class="middle-todo">
          <div class="top-middle">
            <p><strong>Title: </strong> <i> ${title}</i></p>
          </div>
          <div class="bottom-middle">
            <p><strong>Due date: </strong> <i> ${date}</i></p>
            <p><strong>Priority: </strong><i> ${priority}</i></p>
          </div>
        </div>
        <div class="right-todo" id="${id}">
          <button onclick="editToDo(this)" type="button" class="btn" id="edit-btn">Edit</button>
          <button onclick="deleteToDo(this)" type="button" class="btn" id="delete-btn">Delete</button>
        </div>
      </div>
    `;
    }
  );
};
