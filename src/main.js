import {
  saveTask,
  onGetTask,
  deleteTask,
  getTask,
  updateTask,
  signUp,
  signIn,
  onAuthStateChanged,
  signOut,
} from "./firebase.js";

// Add new Task
// Edit Task Status for the task list in the database
let editStatus = false;
// Edit Task ID for the task list in the database
let id = "";
// Check if the user is logged in
// Listen to the authentication state
onAuthStateChanged();
// Add Task Form
const addTaskForm = document.querySelector("#add-task-form");
if (addTaskForm) {
  addTaskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Get the values from the form
    const title = addTaskForm["title"].value;
    const description = addTaskForm["description"].value;
    const status = addTaskForm["status"].value;
    const userid = sessionStorage.getItem("uid");
    console.log(userid)
    // If the edit status is true, update the task
    if (editStatus) {
      await updateTask(id, {
        title,
        description,
        status,
        userid,
      });
      editStatus = false;
      id = "";
      // If the edit status is false, save the task
    } else {
      await saveTask(title, description, status);
    }
    // Reset the form
    addTaskForm.reset();
  });
}
// Get all tasks
window.addEventListener("DOMContentLoaded", async () => {
  // Task Container to display the tasks
  const taskContainer = document.querySelector(".task-container");
  if (!taskContainer) return;
  // Get all tasks
  onGetTask((tasks) => {
    taskContainer.innerHTML = "";
    if (tasks.length === 0) {
      taskContainer.innerHTML = `
        <div class="text-center">
          <h2 class="text-2xl font-bold">No tasks found</h2>
        </div>
      `;
    } else {
      // Display the tasks in the task container div element
      tasks.forEach((task) => {
        // Add the task to the task container
        taskContainer.innerHTML += `
        <div class="border-2 rounded-md py-2 px-4 w-[400px]">
          <h3 class="font-bold">${task.title}</h3>
          <p>${task.description}</p>
          <p class="${
            task.status === "todo"
              ? "text-red-500"
              : task.status === "in-progress"
              ? "text-yellow-500"
              : "text-green-500"
          }">${
          task.status === "todo"
            ? "To Do"
            : task.status === "in-progress"
            ? "In Progress"
            : "Done"
        }</p>
          <div class="flex justify-end gap-2 mt-3">
            <button class="btn-delete bg-red-500 text-white px-2 py-1 rounded-md" data-id="${
              task.id
            }">Remove</button>
            <button class="btn-edit bg-blue-500 text-white px-2 py-1 rounded-md" data-id="${
              task.id
            }">Edit</button>
          </div>
        </div>
        `;
        // Logic for delete task button
        // Get all delete buttons and add an event listener to each of them to delete the task
        taskContainer.querySelectorAll(".btn-delete").forEach((btn, index) => {
          // Add an event listener to each delete button to delete the task
          btn.addEventListener("click", ({ target: { dataset } }) => {
            deleteTask(dataset.id);
          });
        });
        // Logic for edit task button
        // Get all edit buttons and add an event listener to each of them to edit the task
        const editButtons = taskContainer.querySelectorAll(".btn-edit");
        editButtons.forEach((btn, index) => {
          // Add an event listener to each edit button to get the task and display it in the form
          btn.addEventListener("click", async ({ target: { dataset } }) => {
            const doc = await getTask(dataset.id);
            const task = doc.data();
            addTaskForm["title"].value = task.title;
            addTaskForm["description"].value = task.description;
            addTaskForm["status"].value = task.status;
            editStatus = true;
            id = doc.id;
          });
        });
      });
    }
  });
});

// Manage Authentication
// Sign up form
const signUpForm = document.querySelector("#signup-form");
if (signUpForm) {
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Get the values from the form
    const email = signUpForm["signup-email"].value;
    const password = signUpForm["signup-password"].value;
    // Sign up the user
    signUp(email, password);
    signUpForm.reset();
    let modalSignup = document.getElementById("modalSignup");
    let bootstrapModal = bootstrap.Modal.getInstance(modalSignup);
    bootstrapModal.hide();
  });
}
// Sign in form 
const signInForm = document.querySelector("#signin-form");
if (signInForm) {
  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Get the values from the form
    const email = signInForm["signin-email"].value;
    const password = signInForm["signin-password"].value;
    // Sign in the user
    signIn(email, password);
    signInForm.reset();
    let modalSignin = document.getElementById("modalSignin");
    let bootstrapModal = bootstrap.Modal.getInstance(modalSignin);
    bootstrapModal.hide();
  });
}
// Sign out button 
const signOutBtn = document.querySelector("#signout-btn");
if (signOutBtn) {
  signOutBtn.addEventListener("click", () => {
    // Sign out the user
    signOut();
  });
}
