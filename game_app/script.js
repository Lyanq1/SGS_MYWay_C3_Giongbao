// Game State Management
const gameState = {
  currentScreen: "menu",
  gameData: null,
  score: 0,
  level: 1,
  playerPosition: { x: 0, y: 0 }, // Grid coordinates
  gridSize: { width: 14, height: 10 },
  cellSize: 0, // Will be calculated based on container size
  inventory: [],
  gameTime: 60,
  isGameRunning: false,
  currentScreenNumber: 1,
  hasWhistle: false,
  hasFlashlight: false,
  phoneCalled: false,
  whistleUsed: false,
  whistleTimer: 0,
  audioEnabled: true,
};

// Audio System
const audioSystem = {
  playSound: function (soundType) {
    if (!gameState.audioEnabled) return;

    // Create audio context for sound effects
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    switch (soundType) {
      case "collect":
        this.playTone(audioContext, 800, 0.1, "sine");
        break;
      case "success":
        this.playTone(audioContext, 1200, 0.3, "sine");
        break;
      case "whistle":
        this.playTone(audioContext, 2000, 0.5, "square");
        break;
      case "phone":
        this.playTone(audioContext, 600, 0.2, "triangle");
        break;
      case "error":
        this.playTone(audioContext, 300, 0.4, "sawtooth");
        break;
    }
  },

  playTone: function (audioContext, frequency, duration, type) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  },
};

// Screen Elements
const screens = {
  menu: document.getElementById("menu-screen"),
  play: document.getElementById("play-screen"),
  instructions: document.getElementById("instructions-screen"),
  about: document.getElementById("about-screen"),
  screen1: document.getElementById("screen1-supermarket"),
  screen2: document.getElementById("screen2-indoor"),
  screen3: document.getElementById("screen3-bedroom"),
};

// Button Elements
const buttons = {
  playBtn: document.getElementById("play-btn"),
  instructionsBtn: document.getElementById("instructions-btn"),
  aboutBtn: document.getElementById("about-btn"),
  pauseBtn: document.getElementById("pause-btn"),
  menuBtn: document.getElementById("menu-btn"),
  instructionsBackBtn: document.getElementById("instructions-back-btn"),
  aboutBackBtn: document.getElementById("about-back-btn"),
  screen1BackBtn: document.getElementById("screen1-back-btn"),
  screen2BackBtn: document.getElementById("screen2-back-btn"),
  screen3BackBtn: document.getElementById("screen3-back-btn"),
  audioToggle: document.getElementById("audio-toggle"),
};

// Check if buttons exist before adding event listeners
function addEventListenerIfExists(element, event, handler) {
  if (element) {
    element.addEventListener(event, handler);
  }
}

// Screen Management Functions
function showScreen(screenName) {
  // Hide all screens
  Object.values(screens).forEach((screen) => {
    if (screen) {
      screen.classList.remove("active");
    }
  });

  // Show target screen
  if (screens[screenName]) {
    screens[screenName].classList.add("active");
    gameState.currentScreen = screenName;
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  // Menu Navigation
  addEventListenerIfExists(buttons.playBtn, "click", () => {
    showScreen("screen1");
    initializeGame();
  });

  addEventListenerIfExists(buttons.instructionsBtn, "click", () => {
    showScreen("instructions");
  });

  addEventListenerIfExists(buttons.aboutBtn, "click", () => {
    showScreen("about");
  });

  // Back Navigation
  addEventListenerIfExists(buttons.instructionsBackBtn, "click", () => {
    showScreen("menu");
  });

  addEventListenerIfExists(buttons.aboutBackBtn, "click", () => {
    showScreen("menu");
  });

  addEventListenerIfExists(buttons.menuBtn, "click", () => {
    showScreen("menu");
  });

  // Game Controls
  addEventListenerIfExists(buttons.pauseBtn, "click", () => {
    pauseGame();
  });

  // Screen navigation
  addEventListenerIfExists(buttons.screen1BackBtn, "click", () => {
    showScreen("menu");
  });

  addEventListenerIfExists(buttons.screen2BackBtn, "click", () => {
    showScreen("menu");
  });

  addEventListenerIfExists(buttons.screen3BackBtn, "click", () => {
    showScreen("menu");
  });

  // Audio toggle
  addEventListenerIfExists(buttons.audioToggle, "click", () => {
    toggleAudio();
  });
});

// Game Logic Functions
function initializeGame() {
  console.log("Initializing game...");

  // Calculate cell size based on container width
  const container = document.querySelector(".game-container");
  gameState.cellSize = container.offsetWidth / gameState.gridSize.width;

  // Reset game state
  gameState.score = 0;
  gameState.level = 1;
  gameState.playerPosition = { x: 0, y: 0 }; // Start at top-left corner
  gameState.inventory = [];
  gameState.gameTime = 60;
  gameState.isGameRunning = true;
  gameState.currentScreenNumber = 1;

  // Create grid cells
  createGameGrid();

  // Start with Screen 1 (Supermarket)
  showScreen("screen1");
  initializeScreen1();
}

function createGameGrid() {
  const gridContainer = document.querySelector(".game-grid");
  gridContainer.innerHTML = "";

  for (let y = 0; y < gameState.gridSize.height; y++) {
    for (let x = 0; x < gameState.gridSize.width; x++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.dataset.x = x;
      cell.dataset.y = y;
      gridContainer.appendChild(cell);
    }
  }
}

function initializeScreen1() {
  const gameWorld = document.getElementById("supermarket-world");
  const player = document.getElementById("player");

  // Set player initial position
  player.style.left = gameState.playerPosition.x + "px";
  player.style.top = gameState.playerPosition.y + "px";

  // Create supermarket shelves and items
  createSupermarketItems();

  // Start timer
  startTimer("time-display", gameState.gameTime);

  // Setup keyboard controls
  setupKeyboardControls();
}

function initializeScreen2() {
  const gameWorld = document.getElementById("indoor-world");
  const player = document.getElementById("player-2");

  // Set player initial position
  player.style.left = gameState.playerPosition.x + "px";
  player.style.top = gameState.playerPosition.y + "px";

  // Create indoor items
  createIndoorItems();

  // Start 30-second timer
  startTimer("time-display-2", 30);

  // Setup keyboard controls for screen 2
  setupKeyboardControls();
}

function createSupermarketItems() {
  const gameWorld = document.getElementById("supermarket-world");

  // Create shelves using grid coordinates
  const shelves = [
    { x: 1, y: 1, width: 4, height: 1 },
    { x: 7, y: 1, width: 4, height: 1 },
  ];

  shelves.forEach((shelf) => {
    const shelfElement = document.createElement("div");
    shelfElement.className = "supermarket-shelf";
    shelfElement.style.gridColumn = `${shelf.x + 1} / span ${shelf.width}`;
    shelfElement.style.gridRow = `${shelf.y + 1} / span ${shelf.height}`;
    gameWorld.appendChild(shelfElement);
  });

  // Create items on shelves using grid coordinates
  const items = [
    { type: "food", x: 1, y: 1 },
    { type: "water", x: 2, y: 1 },
    { type: "medicine", x: 3, y: 1 },
    { type: "food", x: 7, y: 1 },
    { type: "water", x: 8, y: 1 },
    { type: "medicine", x: 9, y: 1 },
  ];

  items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = `shelf-item ${item.type}-item`;
    itemElement.style.gridColumn = item.x + 1;
    itemElement.style.gridRow = item.y + 1;
    itemElement.dataset.itemType = item.type;
    itemElement.dataset.gridX = item.x;
    itemElement.dataset.gridY = item.y;
    itemElement.addEventListener("click", () =>
      collectItem(itemElement, item.type)
    );
    gameWorld.appendChild(itemElement);
  });
}

function createIndoorItems() {
  const gameWorld = document.getElementById("indoor-world");

  // Create indoor items using grid coordinates
  const items = [
    { type: "fan", x: 2, y: 2, name: "Máy Quạt" },
    { type: "electrical-panel", x: 5, y: 3, name: "Cầu Dao Điện" },
    { type: "pet", x: 3, y: 4, name: "Thú Cưng" },
    { type: "child", x: 6, y: 4, name: "Trẻ Em" },
  ];

  items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = `indoor-item ${item.type}-item`;
    itemElement.style.gridColumn = item.x + 1;
    itemElement.style.gridRow = item.y + 1;
    itemElement.dataset.itemType = item.type;
    itemElement.dataset.itemName = item.name;
    itemElement.dataset.gridX = item.x;
    itemElement.dataset.gridY = item.y;
    itemElement.addEventListener("click", () =>
      interactWithItem(itemElement, item.type)
    );
    gameWorld.appendChild(itemElement);
  });
}

function collectItem(itemElement, itemType) {
  if (gameState.inventory.length < 6) {
    // Max 6 items
    gameState.inventory.push(itemType);
    gameState.score += 10;
    updateScoreDisplay();
    itemElement.style.display = "none";
    showDialogue(`Đã nhặt ${itemType}!`);
    audioSystem.playSound("collect");
  } else {
    showDialogue("Kho đồ đã đầy!");
    audioSystem.playSound("error");
  }
}

function interactWithItem(itemElement, itemType) {
  const itemName = itemElement.dataset.itemName;

  if (itemType === "electrical-panel") {
    showDialogue(
      "Đã tắt cầu dao điện! Bây giờ có thể an toàn rút các thiết bị khác."
    );
    itemElement.style.background = "#95a5a6"; // Gray out
    gameState.score += 20;
    updateScoreDisplay();
    audioSystem.playSound("success");
  } else if (itemType === "fan") {
    showDialogue("Đã rút phích máy quạt!");
    itemElement.style.display = "none";
    gameState.score += 10;
    updateScoreDisplay();
    audioSystem.playSound("collect");
  } else if (itemType === "pet" || itemType === "child") {
    showDialogue(`Đã đưa ${itemName} lên tầng trên an toàn!`);
    itemElement.style.display = "none";
    gameState.score += 15;
    updateScoreDisplay();
    audioSystem.playSound("success");
  }

  // Check if all tasks completed
  checkScreen2Completion();
}

function checkScreen2Completion() {
  const remainingItems = document.querySelectorAll(
    ".indoor-item:not([style*='display: none'])"
  );
  if (remainingItems.length === 0) {
    showDialogue("HÃY NHỚ TẮT CẦU DAO ĐIỆN TỔNG TRƯỚC NHÉ");
    setTimeout(() => {
      initializeScreen3();
      showScreen("screen3");
      gameState.currentScreenNumber = 3;
    }, 2000);
  }
}

function initializeScreen3() {
  const gameWorld = document.getElementById("bedroom-world");
  const player = document.getElementById("player-3");

  // Set player initial position
  player.style.left = gameState.playerPosition.x + "px";
  player.style.top = gameState.playerPosition.y + "px";

  // Create bedroom items
  createBedroomItems();

  // Start 30-second timer
  startTimer("time-display-3", 30);

  // Setup phone interface
  setupPhoneInterface();

  // Setup keyboard controls for screen 3
  setupKeyboardControls();
}

function createBedroomItems() {
  const gameWorld = document.getElementById("bedroom-world");

  // Create bedroom items using grid coordinates
  const items = [
    { type: "bed", x: 2, y: 3, width: 2, height: 1, name: "Giường" },
    { type: "wardrobe", x: 7, y: 2, name: "Tủ" },
    { type: "phone", x: 4, y: 4, name: "Điện Thoại" },
    { type: "whistle", x: 5, y: 4, name: "Còi" },
    { type: "flashlight", x: 3, y: 2, name: "Đèn Pin" },
  ];

  items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = `bedroom-item ${item.type}-item`;
    if (item.width) {
      itemElement.style.gridColumn = `${item.x + 1} / span ${item.width}`;
      itemElement.style.gridRow = `${item.y + 1} / span ${item.height || 1}`;
    } else {
      itemElement.style.gridColumn = item.x + 1;
      itemElement.style.gridRow = item.y + 1;
    }
    itemElement.dataset.itemType = item.type;
    itemElement.dataset.itemName = item.name;
    itemElement.dataset.gridX = item.x;
    itemElement.dataset.gridY = item.y;
    itemElement.addEventListener("click", () =>
      interactWithBedroomItem(itemElement, item.type)
    );
    gameWorld.appendChild(itemElement);
  });
}

function interactWithBedroomItem(itemElement, itemType) {
  const itemName = itemElement.dataset.itemName;

  if (itemType === "phone") {
    showDialogue("Đã lấy điện thoại! Bây giờ có thể gọi cầu cứu.");
    itemElement.style.display = "none";
    showPhoneInterface();
  } else if (itemType === "whistle") {
    showDialogue("Đã lấy còi! Sẽ dùng để phát tín hiệu khi đoàn cứu hộ đến.");
    itemElement.style.display = "none";
    gameState.hasWhistle = true;
  } else if (itemType === "flashlight") {
    showDialogue("Đã lấy đèn pin! Có thể dùng để chiếu sáng.");
    itemElement.style.display = "none";
    gameState.hasFlashlight = true;
  }
}

function setupPhoneInterface() {
  const phoneDisplay = document.getElementById("phone-display");
  const phoneButtons = document.querySelectorAll(".phone-btn[data-number]");
  const callBtn = document.getElementById("call-btn");
  const clearBtn = document.getElementById("clear-btn");

  let phoneNumber = "";

  phoneButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (phoneNumber.length < 3) {
        phoneNumber += btn.dataset.number;
        phoneDisplay.textContent = phoneNumber;
      }
    });
  });

  clearBtn.addEventListener("click", () => {
    phoneNumber = "";
    phoneDisplay.textContent = "114";
  });

  callBtn.addEventListener("click", () => {
    if (
      phoneNumber === "114" ||
      phoneNumber === "115" ||
      phoneNumber === "113"
    ) {
      showDialogue(
        "Đã gọi cầu cứu thành công! Đoàn cứu hộ sẽ đến trong 5 giây."
      );
      gameState.phoneCalled = true;
      hidePhoneInterface();
      audioSystem.playSound("phone");
      setTimeout(() => {
        showRescueTeam();
      }, 5000);
    } else {
      showDialogue("Số điện thoại không đúng! Hãy gọi 114, 115, hoặc 113.");
      audioSystem.playSound("error");
    }
  });
}

function showPhoneInterface() {
  const phoneInterface = document.getElementById("phone-interface");
  phoneInterface.style.display = "block";
}

function hidePhoneInterface() {
  const phoneInterface = document.getElementById("phone-interface");
  phoneInterface.style.display = "none";
}

function showRescueTeam() {
  const rescueTeam = document.getElementById("rescue-team");
  rescueTeam.style.display = "block";

  showDialogue("Đoàn cứu hộ đã đến! Hãy bấm còi để phát tín hiệu!");

  // Start whistle timer
  gameState.whistleTimer = 10;
  const whistleInterval = setInterval(() => {
    gameState.whistleTimer--;
    if (gameState.whistleTimer <= 0) {
      clearInterval(whistleInterval);
      if (!gameState.whistleUsed) {
        showDialogue("Hết thời gian! Đoàn cứu hộ đã rời đi. Game over!");
        setTimeout(() => {
          showScreen("menu");
        }, 2000);
      }
    }
  }, 1000);
}

function useWhistle() {
  if (
    gameState.hasWhistle &&
    gameState.phoneCalled &&
    gameState.whistleTimer > 0
  ) {
    showDialogue("Đã phát tín hiệu còi! Đoàn cứu hộ đã nhận được tín hiệu!");
    gameState.whistleUsed = true;
    gameState.score += 50;
    updateScoreDisplay();
    audioSystem.playSound("whistle");

    setTimeout(() => {
      showDialogue("Chúc mừng! Bạn đã được cứu thành công!");
      audioSystem.playSound("success");
      setTimeout(() => {
        showScreen("menu");
        gameState.isGameRunning = false;
      }, 2000);
    }, 1000);
  } else if (!gameState.hasWhistle) {
    showDialogue("Bạn chưa có còi!");
    audioSystem.playSound("error");
  } else if (!gameState.phoneCalled) {
    showDialogue("Hãy gọi cầu cứu trước!");
    audioSystem.playSound("error");
  } else {
    showDialogue("Hết thời gian để phát tín hiệu!");
    audioSystem.playSound("error");
  }
}

function showDialogue(text) {
  const dialogueText = document.querySelector(".dialogue-text");
  if (dialogueText) {
    dialogueText.textContent = text;
  }
}

function updateScoreDisplay() {
  const scoreDisplay = document.getElementById("score-display");
  if (scoreDisplay) {
    scoreDisplay.textContent = gameState.score;
  }
}

let gameTimer = null;

function startTimer(displayId, time) {
  // Clear any existing timer
  if (gameTimer) {
    clearInterval(gameTimer);
  }

  gameState.gameTime = time;
  const display = document.getElementById(displayId);

  gameTimer = setInterval(() => {
    gameState.gameTime--;
    if (display) {
      display.textContent = gameState.gameTime;
    }

    if (gameState.gameTime <= 0) {
      clearInterval(gameTimer);
      gameTimer = null;
      if (gameState.currentScreenNumber === 1) {
        showDialogue("Hết thời gian! Hãy chuyển sang chuẩn bị trong nhà.");
        setTimeout(() => {
          initializeScreen2();
          showScreen("screen2");
          gameState.currentScreenNumber = 2;
        }, 2000);
      } else {
        showDialogue("Hết thời gian! Game over!");
      }
    }
  }, 1000);
}

let keyboardListenerAdded = false;

function setupKeyboardControls() {
  if (!keyboardListenerAdded) {
    document.addEventListener("keydown", handleKeyPress);
    keyboardListenerAdded = true;
  }
}

function handleKeyPress(event) {
  if (!gameState.isGameRunning) return;

  let playerId;
  if (gameState.currentScreenNumber === 1) {
    playerId = "player";
  } else if (gameState.currentScreenNumber === 2) {
    playerId = "player-2";
  } else if (gameState.currentScreenNumber === 3) {
    playerId = "player-3";
  }

  const player = document.getElementById(playerId);
  const sprite = player.querySelector(".character-sprite");

  if (!player || !sprite) return;

  let moved = false;
  let direction = "";
  let newX = gameState.playerPosition.x;
  let newY = gameState.playerPosition.y;

  switch (event.key.toLowerCase()) {
    case "arrowup":
    case "w":
      event.preventDefault();
      if (newY > 0) {
        newY--;
        moved = true;
        direction = "up";
      }
      break;
    case "arrowdown":
    case "s":
      event.preventDefault();
      if (newY < gameState.gridSize.height - 1) {
        newY++;
        moved = true;
        direction = "down";
      }
      break;
    case "arrowleft":
    case "a":
      event.preventDefault();
      if (newX > 0) {
        newX--;
        sprite.style.transform = "scaleX(-1)";
        moved = true;
        direction = "left";
      }
      break;
    case "arrowright":
    case "d":
      event.preventDefault();
      if (newX < gameState.gridSize.width - 1) {
        newX++;
        sprite.style.transform = "scaleX(1)";
        moved = true;
        direction = "right";
      }
      break;
    case "f":
      event.preventDefault();
      // Interaction logic will be handled by clicking items
      break;
    case "space":
      event.preventDefault();
      if (gameState.currentScreenNumber === 3) {
        useWhistle();
      }
      break;
  }

  if (moved) {
    // Update position if movement is valid
    gameState.playerPosition.x = newX;
    gameState.playerPosition.y = newY;

    // Convert grid coordinates to pixels
    const pixelX = newX * gameState.cellSize;
    const pixelY = newY * gameState.cellSize;

    // Update player position
    player.style.left = pixelX + "px";
    player.style.top = pixelY + "px";

    // Add walking animation
    sprite.classList.add("walking");
    sprite.dataset.direction = direction;
    clearTimeout(gameState.walkTimer);
    gameState.walkTimer = setTimeout(() => {
      sprite.classList.remove("walking");
    }, 200);
  }
}

function pauseGame() {
  console.log("Game paused");
  // Pause logic will be implemented based on game mechanics
  alert("Game paused! (Feature to be implemented)");
}

function updateScore(points) {
  gameState.score += points;
  console.log(`Score updated: ${gameState.score}`);
  // Update score display if game is active
  if (gameState.currentScreen === "play") {
    const gameArea = document.getElementById("game-area");
    const scoreElement = gameArea.querySelector("p");
    if (scoreElement) {
      scoreElement.textContent = `Score: ${gameState.score}`;
    }
  }
}

function nextLevel() {
  gameState.level++;
  console.log(`Level up! Now at level ${gameState.level}`);

  if (gameState.currentScreenNumber === 2) {
    // Game completed
    showDialogue(
      `Chúc mừng! Bạn đã hoàn thành game với điểm số: ${gameState.score}`
    );
    setTimeout(() => {
      showScreen("menu");
      gameState.isGameRunning = false;
    }, 3000);
  }
}

// Audio Functions
function toggleAudio() {
  gameState.audioEnabled = !gameState.audioEnabled;
  const audioBtn = document.getElementById("audio-toggle");

  if (gameState.audioEnabled) {
    audioBtn.textContent = "🔊";
    audioBtn.classList.remove("muted");
    audioSystem.playSound("success");
  } else {
    audioBtn.textContent = "🔇";
    audioBtn.classList.add("muted");
  }
}

// Utility Functions
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Export functions for potential use in game modules
window.gameUtils = {
  showScreen,
  initializeGame,
  updateScore,
  nextLevel,
  getRandomNumber,
  shuffleArray,
  gameState,
};
