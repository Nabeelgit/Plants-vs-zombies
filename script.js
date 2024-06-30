const startScreen = document.getElementById('start-screen');
const playScreen = document.getElementById('play-screen');
const winScreen = document.getElementById('win-screen');
const loseScreen = document.getElementById('lose-screen');
const startButton = document.getElementById('start-button');
const restartButtonWin = document.getElementById('restart-button-win');
const restartButtonLose = document.getElementById('restart-button-lose');
const gameGrid = document.getElementById('game-grid');
const plantSelector = document.getElementById('plant-selector');
const sunAmount = document.getElementById('sun-amount');

let sun = 50;
let zombiesKilled = 0;
let zombiesSpawned = 0;
const maxZombies = 10;

const plants = [
    { name: 'Sunflower', cost: 50, image: '🌻' },
    { name: 'Peashooter', cost: 100, image: '🌱' }
];

startButton.addEventListener('click', startGame);
restartButtonWin.addEventListener('click', restartGame);
restartButtonLose.addEventListener('click', restartGame);

function startGame() {
    startScreen.classList.add('hidden');
    playScreen.classList.remove('hidden');
    initializeGame();
}

function initializeGame() {
    createGrid();
    createPlantSelector();
    spawnZombies();
    updateSunAmount();
}

function createGrid() {
    for (let i = 0; i < 45; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.addEventListener('click', () => placePlant(cell));
        gameGrid.appendChild(cell);
    }
}

function createPlantSelector() {
    plants.forEach(plant => {
        const plantOption = document.createElement('div');
        plantOption.classList.add('plant-option');
        plantOption.textContent = plant.image;
        plantOption.addEventListener('click', () => selectPlant(plant));
        plantSelector.appendChild(plantOption);
    });
}

let selectedPlant = null;

function selectPlant(plant) {
    if (sun >= plant.cost) {
        selectedPlant = plant;
    } else {
        alert('Not enough sun!');
    }
}

function placePlant(cell) {
    if (selectedPlant && !cell.hasChildNodes()) {
        const plantElement = document.createElement('div');
        plantElement.textContent = selectedPlant.image;
        cell.appendChild(plantElement);
        sun -= selectedPlant.cost;
        updateSunAmount();
        selectedPlant = null;

        if (selectedPlant.name === 'Sunflower') {
            setInterval(() => {
                sun += 25;
                updateSunAmount();
            }, 10000);
        }
    }
}

function spawnZombies() {
    if (zombiesSpawned < maxZombies) {
        const zombie = document.createElement('div');
        zombie.textContent = '🧟';
        zombie.style.position = 'absolute';
        zombie.style.right = '0';
        zombie.style.top = `${Math.floor(Math.random() * 5) * 80}px`;
        playScreen.appendChild(zombie);

        const moveZombie = setInterval(() => {
            const left = parseInt(zombie.style.left || '800');
            if (left > 0) {
                zombie.style.left = `${left - 1}px`;
            } else {
                clearInterval(moveZombie);
                endGame(false);
            }
        }, 50);

        zombiesSpawned++;
        setTimeout(spawnZombies, Math.random() * 5000 + 2000);
    }
}

function updateSunAmount() {
    sunAmount.textContent = sun;
}

function endGame(win) {
    playScreen.classList.add('hidden');
    if (win) {
        winScreen.classList.remove('hidden');
    } else {
        loseScreen.classList.remove('hidden');
    }
}

function restartGame() {
    location.reload();
}

// Check for win condition
setInterval(() => {
    if (zombiesKilled >= maxZombies) {
        endGame(true);
    }
}, 1000);

// Generate sun
setInterval(() => {
    sun += 25;
    updateSunAmount();
}, 10000);
