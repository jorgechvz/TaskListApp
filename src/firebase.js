import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  MESSAGING_SENDER_ID,
  PROJECT_ID,
  STORAGE_BUCKET,
} from "../env.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Connect to authentication and firestore
const auth = getAuth(app);
const db = getFirestore();

// CREATE
// Add a new taks to the database
export const saveTask = (title, description, status) => {
  // Add a new document with a generated id.
  return addDoc(collection(db, "tasks"), {
    title: title,
    description: description,
    status: status,
    userid: sessionStorage.getItem("uid"),
  });
};

// READ
// Get all tasks from the database
export const getTasks = async () => {
  // Get a list of tasks from the database collection
  const querySnapshot = await getDocs(collection(db, "tasks"));
  let tasks = [];
  // Loop through the tasks and push them to the tasks array
  querySnapshot.forEach((doc) => {
    tasks.push({ ...doc.data(), id: doc.id });
  });
  console.log(tasks);
  return tasks;
};
// Get a tasks from the database using the user id as a query
// onSnapshot function is used to listen to the data from the query snapshot and return the tasks array
export const onGetTask = (callback) => {
  // Get the user uid from the session storage
  const userUid = sessionStorage.getItem("uid");
  // Create a query to get the tasks that belong to the logged in user
  const q = query(collection(db, "tasks"), where("userid", "==", userUid));
  // Listen to the data from the query snapshot and return the tasks array
  return onSnapshot(q, (querySnapshot) => {
    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ ...doc.data(), id: doc.id });
    });
    callback(tasks);
  });
};

// UPDATE
// Update a task in the database
// getTask function is used to get a single task from the database
export const getTask = (id) => getDoc(doc(db, "tasks", id));
// updateTask function is used to update a task in the database
export const updateTask = (id, updatedTask) => {
  const docRef = doc(db, "tasks", id);
  return updateDoc(docRef, updatedTask);
};

// DELETE
// Delete a task from the database
export const deleteTask = (id) => {
  deleteDoc(doc(db, "tasks", id));
};

// AUTHENTICATION
// Sign up
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};
// Sign in
export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      // Store the user uid in the session storage
      sessionStorage.setItem("uid", user.uid);
      // Push the user to the index page
      window.location.href = "/src/index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

// Sign out
export const signOut = () => {
  sessionStorage.removeItem("uid"); // Remove the user uid from the session storage
  window.location.href = "/src/home.html"; // Redirect to the home pagex
  return auth.signOut();
};

// Check if the user is logged in
export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged((user) => {
    if (user) {
      // Store the user uid in the session storage
      let userUid = auth.currentUser.uid;
      // If the user uid is not in the session storage, store it
      if (
        sessionStorage.getItem("uid") === null ||
        sessionStorage.getItem("uid") === ""
      ) {
        sessionStorage.setItem("uid", userUid);
      }
      console.log("User is logged in");
      // If the user is not on the index page, redirect to the index page
      if (window.location.pathname !== "/src/index.html") {
        window.location.href = "/src/index.html"; // Redirect to index page
      }
    } else {
      console.log("User is logged out");
      // If the user is not on the home page, redirect to the home page
      if (window.location.pathname !== "/src/home.html") {
        window.location.href = "/src/home.html"; // Redirect to home page
      }
    }
  });
};
