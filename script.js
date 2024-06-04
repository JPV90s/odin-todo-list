const addToDo = document.querySelector("#add-todo");
const showAll = document.getElementById("show-all");
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
const filterText = document.querySelector(".filter-text");

const toDoData = JSON.parse(localStorage.getItem("data")) || [];
let currentToDo = {};

addToDo.addEventListener("click", () => {
  submitOrEditToDo.value = "Add Task";
  dialogToDo.showModal();
});
cancelBtn.addEventListener("click", () => {
  dialogToDo.close();
  toDoForm.reset();
});
submitOrEditToDo.addEventListener("click", () => {
  dialogToDo.close();
});

showAll.addEventListener("click", () => {
  updateToDoContainer();
  filterText.innerText = "ALL";
});

const addOrUpdateToDo = () => {
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
};

const updateToDoContainer = () => {
  todoList.innerHTML = "";

  toDoData.forEach(({ id, title, priority, category, description, date }) => {
    todoList.innerHTML += `
    <div class="${id} todo" id="${id}">
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
        `;
  });
};

const deleteToDo = (buttonEl) => {
  const dataArrIndex = toDoData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  const toDoIdDelete = toDoData[dataArrIndex].id;
  const toDoElementDelete = document.getElementById(`${toDoIdDelete}`);

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

  dialogToDo.showModal();
  submitOrEditToDo.value = "Update Task";
};

if (toDoData.length) {
  updateToDoContainer();
}

toDoForm.addEventListener("submit", (e) => {
  addOrUpdateToDo();
});

const filterToDos = (filterOption) => {
  todoList.innerHTML = "";

  const filteredToDos = toDoData.filter(
    (todo) => todo.category === filterOption || todo.priority === filterOption
  );

  filterText.innerText = filterOption.toUpperCase();

  if (filteredToDos.length) {
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
            <button onclick="editToDo(this)" type="button" class="btn" id="edit-btn">Edit</button>
            <button onclick="deleteToDo(this)" type="button" class="btn" id="delete-btn">Delete</button>
        </div>
      `;
      }
    );
  } else {
    todoList.innerHTML += `<p id="no-match"> There are no ToDos that match the current selection.</p>`;
  }
};

const categoryContainer = document.querySelector(".categories");

categoryContainer.addEventListener("click", (event) => {
  const clickedCategory = event.target.closest(".category");
  if (clickedCategory) {
    const categoryId = clickedCategory.id;
    console.log(categoryId);
    filterToDos(categoryId);
  }
});

const priorityContainer = document.querySelector(".priorities");

priorityContainer.addEventListener("click", (event) => {
  const clickedPriority = event.target.closest(".priority");
  if (clickedPriority) {
    const priorityId = clickedPriority.id;
    console.log(priorityId);
    filterToDos(priorityId);
  }
});
