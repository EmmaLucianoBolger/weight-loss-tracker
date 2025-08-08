// Load data from LocalStorage
let foodData = JSON.parse(localStorage.getItem("foodData")) || [];
let exerciseData = JSON.parse(localStorage.getItem("exerciseData")) || [];
let weightData = JSON.parse(localStorage.getItem("weightData")) || [];
let calorieGoal = localStorage.getItem("calorieGoal") || "";
let weightChart;
// set calorie goal
document.getElementById("calorieGoal").value = calorieGoal;

// Save all data to LocalStorage
function saveData() {
  localStorage.setItem("foodData", JSON.stringify(foodData));
  localStorage.setItem("exerciseData", JSON.stringify(exerciseData));
  localStorage.setItem("weightData", JSON.stringify(weightData));
  localStorage.setItem("calorieGoal", calorieGoal);
}

// food
function addFood() {
  const name = document.getElementById("foodName").value.trim();
  const calories = parseInt(document.getElementById("foodCalories").value);

  if (!name || isNaN(calories)) return;

  foodData.push({ name, calories });
  saveData();
  renderFood();
  updateNetCalories();

  document.getElementById("foodName").value = "";
  document.getElementById("foodCalories").value = "";
}

function renderFood() {
  const list = document.getElementById("foodList");
  list.innerHTML = "";
  foodData.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - ${item.calories} cal 
      <button onclick="deleteFood(${index})">🐾</button>`;
    list.appendChild(li);
  });
}

function deleteFood(index) {
  foodData.splice(index, 1);
  saveData();
  renderFood();
  updateNetCalories();
}

//exercise
function addExercise() {
  const name = document.getElementById("exerciseName").value.trim();
  const calories = parseInt(document.getElementById("exerciseCalories").value);

  if (!name || isNaN(calories)) return;

  exerciseData.push({ name, calories });
  saveData();
  renderExercise();
  updateNetCalories();

  document.getElementById("exerciseName").value = "";
  document.getElementById("exerciseCalories").value = "";
}

function renderExercise() {
  const list = document.getElementById("exerciseList");
  list.innerHTML = "";
  exerciseData.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - ${item.calories} cal burned 
      <button onclick="deleteExercise(${index})">🐾</button>`;
    list.appendChild(li);
  });
}

function deleteExercise(index) {
  exerciseData.splice(index, 1);
  saveData();
  renderExercise();
  updateNetCalories();
}

// weight
function addWeight() {
  const weight = parseFloat(document.getElementById("weightInput").value);
  if (isNaN(weight)) return;

  const date = new Date().toLocaleDateString();
  weightData.push({ date, weight });
  saveData();
  renderWeight();

  document.getElementById("weightInput").value = "";
}

function renderWeight() {
  const list = document.getElementById("weightList");
  list.innerHTML = "";
  weightData.forEach((entry, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${entry.date} - ${entry.weight} kg 
      <button onclick="deleteWeight(${index})">🐾</button>`;
    list.appendChild(li);
  });

  updateWeightChart();
}

function deleteWeight(index) {
  weightData.splice(index, 1);
  saveData();
  renderWeight();
}

// calorie goal
document.getElementById("calorieGoal").addEventListener("input", function () {
  calorieGoal = this.value;
  saveData();
  updateNetCalories();
});

// net calories
function updateNetCalories() {
  const totalIn = foodData.reduce((sum, item) => sum + item.calories, 0);
  const totalOut = exerciseData.reduce((sum, item) => sum + item.calories, 0);
  const net = totalIn - totalOut;

  document.getElementById("netCalories").textContent = `Net Calories: ${net}`;
  const msg = document.getElementById("calorieMessage");

  if (!calorieGoal || isNaN(calorieGoal)) {
    msg.textContent = "Set a goal to get started! 🧸";
  } else if (net < calorieGoal) {
    msg.textContent = `${calorieGoal - net} calories under goal 🐻`;
  } else if (net === parseInt(calorieGoal)) {
    msg.textContent = "Right on target! 🎯";
  } else {
    msg.textContent = `${net - calorieGoal} calories over goal 🐻`;
  }
}

// reset
function resetLogs() {
  foodData = [];
  exerciseData = [];
  saveData();
  renderFood();
  renderExercise();
  updateNetCalories();
}

// 
renderFood();
renderExercise();
renderWeight();
updateNetCalories();
updateWeightChart();

// update chart
function updateWeightChart() {
  const ctx = document.getElementById("weightChart").getContext("2d");

  const labels = weightData.map(entry => entry.date);
  const data = weightData.map(entry => entry.weight);

  if (weightChart) {
    weightChart.destroy();
  }

  weightChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Weight Progress 🧸',
        data: data,
        borderColor: '#f78ca2',
        backgroundColor: 'rgba(247, 140, 162, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ffadc3',
        pointBorderColor: '#a35d7d',
        pointRadius: 5,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}


 

