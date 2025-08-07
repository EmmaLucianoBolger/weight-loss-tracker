// Data setup
let foodData = [];
let exerciseData = [];
let weightData = JSON.parse(localStorage.getItem("weightData")) || [];
let calorieGoal = localStorage.getItem("calorieGoal") || "";

document.getElementById("calorieGoal").value = calorieGoal;

// Save only weight data
function saveData() {
  localStorage.setItem("weightData", JSON.stringify(weightData));
}

// Save calorie goal on change
document.getElementById("calorieGoal").addEventListener("input", function () {
  calorieGoal = this.value;
  localStorage.setItem("calorieGoal", calorieGoal);
  updateNetCalories();
});

// Add food
function addFood() {
  const name = document.getElementById("foodName").value;
  const calories = parseInt(document.getElementById("foodCalories").value);
  if (!name || isNaN(calories)) return;

  foodData.push({ name, calories });
  renderFood();
  updateNetCalories();

  document.getElementById("foodName").value = "";
  document.getElementById("foodCalories").value = "";
}

// Add exercise
function addExercise() {
  const name = document.getElementById("exerciseName").value;
  const calories = parseInt(document.getElementById("exerciseCalories").value);
  if (!name || isNaN(calories)) return;

  exerciseData.push({ name, calories });
  renderExercise();
  updateNetCalories();

  document.getElementById("exerciseName").value = "";
  document.getElementById("exerciseCalories").value = "";
}

// Add weight
function addWeight() {
  const weight = parseFloat(document.getElementById("weightInput").value);
  if (isNaN(weight)) return;

  const date = new Date().toLocaleDateString();
  weightData.push({ date, weight });
  saveData();
  renderWeight();

  document.getElementById("weightInput").value = "";
}

// Delete weight entry
function deleteWeight(index) {
  weightData.splice(index, 1);
  saveData();
  renderWeight();
}

// Render food list
function renderFood() {
  const list = document.getElementById("foodList");
  list.innerHTML = "";
  foodData.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.calories} cal`;
    list.appendChild(li);
  });
}

// Render exercise list
function renderExercise() {
  const list = document.getElementById("exerciseList");
  list.innerHTML = "";
  exerciseData.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.calories} cal burned`;
    list.appendChild(li);
  });
}

// Render weight history with delete button
function renderWeight() {
  const list = document.getElementById("weightList");
  list.innerHTML = "";

  weightData.forEach((entry, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${entry.date} - ${entry.weight} kg 
      <button onclick="deleteWeight(${index})" style="margin-left:10px;">❌</button>
    `;
    list.appendChild(li);
  });
}

// Update net calories
function updateNetCalories() {
  const goal = parseInt(document.getElementById("calorieGoal").value) || 0;
  const totalIn = foodData.reduce((sum, f) => sum + f.calories, 0);
  const totalOut = exerciseData.reduce((sum, e) => sum + e.calories, 0);
  const net = totalIn - totalOut;

  document.getElementById("netCalories").textContent = `Net Calories: ${net}`;
  const msg = document.getElementById("calorieMessage");

  if (goal === 0) {
    msg.textContent = "Set a goal to get started! 🧸";
  } else if (net < goal) {
    msg.textContent = "You're under your goal — great job! 🐻✨";
  } else if (net === goal) {
    msg.textContent = "You met your goal perfectly today! 🎉";
  } else {
    msg.textContent = "You're over your goal — tomorrow is a new day! 🌈";
  }
}

// Optional: Reset daily logs for food and exercise
function resetLogs() {
  foodData = [];
  exerciseData = [];
  renderFood();
  renderExercise();
  updateNetCalories();
}

// Initial render
renderFood();
renderExercise();
renderWeight();
updateNetCalories();
