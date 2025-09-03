// ---------------- Global Variables ---------------- //

let foodData = JSON.parse(localStorage.getItem("foodData")) || [];
let exerciseData = JSON.parse(localStorage.getItem("exerciseData")) || [];
let weightData = JSON.parse(localStorage.getItem("weightData")) || [];
let calorieGoal = localStorage.getItem("calorieGoal") || "";
let goalWeight = localStorage.getItem("goalWeight") || "";
let weightChart;

// Set initial values
document.getElementById("calorieGoal").value = calorieGoal;
document.getElementById("goalWeightInput").value = goalWeight;

// ---------------- Event Listeners ---------------- //

document.getElementById("addFoodBtn").addEventListener("click", addFood);
document.getElementById("addExerciseBtn").addEventListener("click", addExercise);
document.getElementById("addWeightBtn").addEventListener("click", addWeight);
document.getElementById("resetBtn").addEventListener("click", resetLogs);

["foodCalories", "exerciseCalories", "weightInput"].forEach(id => {
  document.getElementById(id).addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (id === "foodCalories") addFood();
      if (id === "exerciseCalories") addExercise();
      if (id === "weightInput") addWeight();
    }
  });
});

// Calorie goal input
document.getElementById("calorieGoal").addEventListener("input", function () {
  calorieGoal = this.value;
  localStorage.setItem("calorieGoal", calorieGoal);
  updateNetCalories();
});

// Goal weight input
document.getElementById("goalWeightInput").addEventListener("input", function() {
  goalWeight = this.value;
  localStorage.setItem("goalWeight", goalWeight);
  updateWeightChart();
});

// ---------------- Save / Load ---------------- //

function saveData() {
  localStorage.setItem("foodData", JSON.stringify(foodData));
  localStorage.setItem("exerciseData", JSON.stringify(exerciseData));
  localStorage.setItem("weightData", JSON.stringify(weightData));
  localStorage.setItem("calorieGoal", calorieGoal);
  localStorage.setItem("goalWeight", goalWeight);
}

// ---------------- Food Section ---------------- //

function addFood() {
  const name = document.getElementById("foodName").value.trim();
  const calories = parseInt(document.getElementById("foodCalories").value);
  if (!name || isNaN(calories) || calories < 0) return;

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
    li.style.background = "#fff8f2";
    li.style.border = "2px solid #a35d7d";
    li.style.borderRadius = "12px";
    li.style.padding = "0.5rem 1rem";
    li.style.marginBottom = "0.5rem";
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.color = "#a35d7d";
    li.style.fontFamily = "'Comic Sans MS', cursive";

    li.innerHTML = `
      <span>${item.name} - ${item.calories} cal</span>
      <button class="deleteFoodBtn" data-index="${index}" style="
        background-color:#f78ca2;
        border:none;
        border-radius:50%;
        width:28px;
        height:28px;
        cursor:pointer;
        color:white;
        font-size:1rem;
      ">🐾</button>
    `;
    list.appendChild(li);
  });

  document.querySelectorAll(".deleteFoodBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = e.currentTarget.getAttribute("data-index");
      deleteFood(parseInt(idx));
    });
  });
}

function deleteFood(index) {
  foodData.splice(index, 1);
  saveData();
  renderFood();
  updateNetCalories();
}

// ---------------- Exercise Section ---------------- //

function addExercise() {
  const name = document.getElementById("exerciseName").value.trim();
  const calories = parseInt(document.getElementById("exerciseCalories").value);
  if (!name || isNaN(calories) || calories < 0) return;

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
    li.style.background = "#fff8f2";
    li.style.border = "2px solid #a35d7d";
    li.style.borderRadius = "12px";
    li.style.padding = "0.5rem 1rem";
    li.style.marginBottom = "0.5rem";
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.color = "#a35d7d";
    li.style.fontFamily = "'Comic Sans MS', cursive";

    li.innerHTML = `
      <span>${item.name} - ${item.calories} cal burned</span>
      <button class="deleteExerciseBtn" data-index="${index}" style="
        background-color:#f78ca2;
        border:none;
        border-radius:50%;
        width:28px;
        height:28px;
        cursor:pointer;
        color:white;
        font-size:1rem;
      ">🐾</button>
    `;
    list.appendChild(li);
  });

  document.querySelectorAll(".deleteExerciseBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = e.currentTarget.getAttribute("data-index");
      deleteExercise(parseInt(idx));
    });
  });
}

function deleteExercise(index) {
  exerciseData.splice(index, 1);
  saveData();
  renderExercise();
  updateNetCalories();
}

// ---------------- Net Calories & Encouragement ---------------- //

function updateNetCalories() {
  const totalIn = foodData.reduce((sum, item) => sum + item.calories, 0);
  const totalOut = exerciseData.reduce((sum, item) => sum + item.calories, 0);
  const net = totalIn - totalOut;

  document.getElementById("netCalories").textContent = `Net Calories: ${net}`;
  updateEncouragement();
}

function updateEncouragement() {
  const msg = document.getElementById("calorieMessage");
  const net = foodData.reduce((sum, item) => sum + item.calories, 0) - 
              exerciseData.reduce((sum, item) => sum + item.calories, 0);

  if (!calorieGoal) {
    msg.textContent = "Set a goal to get started! 🧸";
  } else if (net < calorieGoal * 0.8) {
    msg.textContent = "Amazing job! You’re under your goal today! 🌟";
  } else if (net <= calorieGoal) {
    msg.textContent = "Right on target! Keep it up! 🐻";
  } else {
    msg.textContent = "Don't worry, tomorrow is a new chance! 🧸";
  }
}

// ---------------- Reset ---------------- //

function resetLogs() {
  foodData = [];
  exerciseData = [];
  saveData();
  renderFood();
  renderExercise();
  updateNetCalories();
}

// ---------------- Weight Section ---------------- //

function addWeight() {
  const weightInput = document.getElementById("weightInput");
  const weight = parseFloat(weightInput.value);
  if (isNaN(weight) || weight <= 0) return;

  const date = new Date().toLocaleDateString();
  weightData.push({ date, weight });
  saveData();
  renderWeight();

  weightInput.value = "";
}

function renderWeight() {
  const list = document.getElementById("weightList");
  list.innerHTML = "";

  weightData.forEach((entry, index) => {
    const li = document.createElement("li");
    li.style.background = "#fff8f2";
    li.style.border = "2px solid #a35d7d";
    li.style.borderRadius = "12px";
    li.style.padding = "0.5rem 1rem";
    li.style.marginBottom = "0.5rem";
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.color = "#a35d7d";
    li.style.fontFamily = "'Comic Sans MS', cursive";

    li.innerHTML = `
      <span>${entry.date} - ${entry.weight} kg</span>
      <button class="deleteWeightBtn" data-index="${index}" style="
        background-color:#f78ca2;
        border:none;
        border-radius:50%;
        width:28px;
        height:28px;
        cursor:pointer;
        color:white;
        font-size:1rem;
      ">🐾</button>
    `;

    list.appendChild(li);
  });

  document.querySelectorAll(".deleteWeightBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = e.currentTarget.getAttribute("data-index");
      deleteWeight(parseInt(idx));
    });
  });

  updateWeightChart();
  displayStreak();
}

function deleteWeight(index) {
  weightData.splice(index, 1);
  saveData();
  renderWeight();
}

// ---------------- Weight Chart ---------------- //

function updateWeightChart() {
  const ctx = document.getElementById("weightChart").getContext("2d");

  const labels = weightData.map(entry => entry.date); // use dates on x-axis
  const data = weightData.map(entry => entry.weight); // weights on y-axis

  if (weightChart) weightChart.destroy();

  const datasets = [
    {
      label: 'Weight Progress 🧸',
      data: data,
      borderColor: '#f78ca2',
      backgroundColor: 'rgba(247, 140, 162, 0.2)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#ffe4ec',
      pointBorderColor: '#a35d7d',
      pointRadius: 6,
      borderWidth: 3
    }
  ];

  if (goalWeight && !isNaN(goalWeight)) {
    datasets.push({
      label: 'Goal Weight 🎯',
      data: new Array(labels.length).fill(goalWeight),
      borderColor: '#f9d89c',
      borderDash: [6,6],
      borderWidth: 2,
      pointRadius: 0,
      fill: false
    });
  }

  weightChart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#a35d7d',
            font: { family: "'Comic Sans MS', cursive" }
          }
        }
      },
      scales: {
        x: { ticks: { color: '#a35d7d' }, grid: { color: '#fff8f2' } },
        y: { ticks: { color: '#a35d7d' }, grid: { color: '#fff8f2' }, beginAtZero: false }
      }
    }
  });
}


// ---------------- Weight Streak Tracker ---------------- //

function calculateStreak() {
  if (!weightData.length) return 0;
  let streak = 1;

  for (let i = weightData.length - 1; i > 0; i--) {
    const prevDate = new Date(weightData[i-1].date);
    const currDate = new Date(weightData[i].date);
    const diff = (currDate - prevDate) / (1000*60*60*24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function displayStreak() {
  let streakMsg = document.getElementById("streakMessage");
  if (!streakMsg) {
    streakMsg = document.createElement("p");
    streakMsg.id = "streakMessage";
    streakMsg.style.fontFamily = "'Comic Sans MS', cursive";
    streakMsg.style.color = "#a35d7d";
    streakMsg.style.marginTop = "0.5rem";
    document.getElementById("weight-section").appendChild(streakMsg);
  }
  const streak = calculateStreak();
  streakMsg.textContent = `🔥 Current Weight Logging Streak: ${streak} day${streak > 1 ? 's' : ''}!`;
}

// ---------------- Initial Render ---------------- //

renderFood();
renderExercise();
renderWeight();
updateNetCalories();
