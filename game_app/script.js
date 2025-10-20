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
  essentialItems: 0, // number of essential items collected in screen 1
  gameTime: 60,
  isGameRunning: false,
  currentScreenNumber: 1,
  mainPowerOff: false, // screen 2: electrical main switch turned off
  hasWhistle: false,
  hasFlashlight: false,
  hasPhone: false,
  phoneCalled: false,
  whistleUsed: false,
  whistleTimer: 0,
  audioEnabled: true,
  dialogueTimer: null, // Timer for auto-hiding dialogue
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
  screen4: document.getElementById("screen4-success"),
  ending: document.getElementById("screen-ending"),
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

  // screen4 back to menu
  const screen4Back = document.getElementById("screen4-back-btn");
  const screen4Continue = document.getElementById("screen4-continue-btn");
  const screen4Try = document.getElementById("screen4-try-btn");
  addEventListenerIfExists(screen4Continue, "click", () => {
    showScreen("ending");
  });
  addEventListenerIfExists(screen4Try, "click", () => {
    // Retry calling: go back to screen 3
    showScreen("screen3");
  });

  const endingBack = document.getElementById("ending-back-btn");
  addEventListenerIfExists(endingBack, "click", () => {
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
  gameState.essentialItems = 0;
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

  // Reset essential counter display to 0/20
  const essentialDisplay = document.getElementById("essential-items");
  if (essentialDisplay)
    essentialDisplay.textContent = String(gameState.essentialItems);

  // Start timer
  startTimer("time-display", gameState.gameTime);

  // Setup keyboard controls
  setupKeyboardControls();

  // Show quick guidance dialogue at the top
  showDialogue("Hãy ấn vào item để nhặt");
}

function initializeScreen2() {
  const gameWorld = document.getElementById("indoor-world");
  const player = document.getElementById("player-2");

  // Set player initial position
  player.style.left = gameState.playerPosition.x + "px";
  player.style.top = gameState.playerPosition.y + "px";

  // Reset state for screen 2
  gameState.mainPowerOff = false;
  const world = document.getElementById("indoor-world");
  if (world) world.innerHTML = "";

  // Create indoor items
  createIndoorItems();

  // Start 30-second timer
  startTimer("time-display-2", 30);

  // Setup keyboard controls for screen 2
  setupKeyboardControls();

  // Guidance for screen 2
  showDialogue(
    "Hãy tắt cầu dao điện trước, rồi rút phích các thiết bị và đưa thú cưng, trẻ em lên nơi an toàn"
  );
}

function createSupermarketItems() {
  const gameWorld = document.getElementById("supermarket-world");
  const gridSize = gameState.cellSize;

  // Create wall shelves layout
  const wallShelves = [
    // Row 1
    {
      x: 1,
      y: 10,
      width: 3,
      items: [
        { type: "food", color: "#ff6b6b" },
        { type: "water", color: "#4ecdc4" },
        { type: "medicine", color: "#45b7d1" },
      ],
    },
    {
      x: 4,
      y: 10,
      width: 3,
      items: [
        { type: "food", color: "#ff6b6b" },
        { type: "water", color: "#4ecdc4" },
        { type: "medicine", color: "#45b7d1" },
      ],
    },
    {
      x: 7,
      y: 10,
      width: 3,
      items: [
        { type: "food", color: "#ff6b6b" },
        { type: "water", color: "#4ecdc4" },
        { type: "medicine", color: "#45b7d1" },
      ],
    },
    {
      x: 10,
      y: 10,
      width: 3,
      items: [
        { type: "food", color: "#ff6b6b" },
        { type: "water", color: "#4ecdc4" },
        { type: "medicine", color: "#45b7d1" },
      ],
    },
    // Row 2
    {
      x: 1,
      y: 4,
      width: 3,
      items: [
        { type: "food", color: "#ff6b6b" },
        { type: "water", color: "#4ecdc4" },
        { type: "medicine", color: "#45b7d1" },
      ],
    },
    {
      x: 4,
      y: 4,
      width: 3,
      items: [
        { type: "food", color: "#ff6b6b" },
        { type: "water", color: "#4ecdc4" },
        { type: "medicine", color: "#45b7d1" },
      ],
    },
    {
      x: 7,
      y: 4,
      width: 3,
      items: [
        { type: "food", color: "#ff6b6b" },
        { type: "water", color: "#4ecdc4" },
        { type: "medicine", color: "#45b7d1" },
      ],
    },
    {
      x: 10,
      y: 4,
      width: 3,
      items: [
        { type: "food", color: "#ff6b6b" },
        { type: "water", color: "#4ecdc4" },
        { type: "medicine", color: "#45b7d1" },
      ],
    },

    // Row 2
    {
      x: 1,
      y: 6,
      width: 3,
      items: [
        { type: "food", color: "#ff6b6b" },
        { type: "water", color: "#4ecdc4" },
        { type: "medicine", color: "#45b7d1" },
      ],
    },
    {
      x: 4,
      y: 6,
      width: 3,
      items: [
        { type: "food", color: "#ff6b6b" },
        { type: "water", color: "#4ecdc4" },
        { type: "medicine", color: "#45b7d1" },
      ],
    },
    {
      x: 7,
      y: 6,
      width: 3,
      items: [
        { type: "food", color: "#ff6b6b" },
        { type: "water", color: "#4ecdc4" },
        { type: "medicine", color: "#45b7d1" },
      ],
    },
    {
      x: 10,
      y: 6,
      width: 3,
      items: [
        { type: "food", color: "#ff6b6b" },
        { type: "water", color: "#4ecdc4" },
        { type: "medicine", color: "#45b7d1" },
      ],
    },
  ];
  // Use the water bottle image for the first water item we render
  let waterBottleApplied = false;

  wallShelves.forEach((shelf) => {
    const shelfElement = document.createElement("div");
    shelfElement.className = "wall-shelf";
    shelfElement.style.gridColumnStart = shelf.x;
    shelfElement.style.gridColumnEnd = shelf.x + shelf.width;
    shelfElement.style.gridRow = shelf.y;

    // Create two rows of items
    for (let row = 0; row < 2; row++) {
      const rowElement = document.createElement("div");
      rowElement.className = "shelf-row";

      shelf.items.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.className = `shelf-item ${item.type}-item`;
        itemElement.dataset.itemType = item.type;
        itemElement.dataset.itemName = getItemName(item.type);
        itemElement.title = getItemName(item.type);

        const icon = document.createElement("div");
        icon.className = "item-icon";
        icon.style.backgroundColor = item.color;
        // If this is the first water item, use the bottle image
        if (item.type === "water" && !waterBottleApplied) {
          itemElement.classList.add("img-water-bottle");
          waterBottleApplied = true;
        }
        itemElement.appendChild(icon);

        // Add item count display
        const countDisplay = document.createElement("div");
        countDisplay.className = "item-count";
        countDisplay.textContent = "x2";
        itemElement.appendChild(countDisplay);

        itemElement.addEventListener("click", () =>
          collectItem(itemElement, item.type)
        );

        rowElement.appendChild(itemElement);
      });

      shelfElement.appendChild(rowElement);
    }

    gameWorld.appendChild(shelfElement);
  });
}

function getItemName(type) {
  switch (type) {
    case "food":
      return "Đồ Ăn";
    case "water":
      return "Nước Uống";
    case "medicine":
      return "Thuốc";
    default:
      return type;
  }
}

function createIndoorItems() {
  const gameWorld = document.getElementById("indoor-world");

  // Create indoor items using grid coordinates
  const items = [
    { type: "fan", x: 2, y: 2, name: "Máy Quạt" },
    { type: "electrical-panel", x: 5, y: 2, name: "Cầu Dao Điện Tổng" },
    { type: "circuit-breaker", x: 0, y: 0, name: "CB Góc Phòng" },
    { type: "tv", x: 3, y: 3, name: "TV" },
    { type: "pc", x: 6, y: 3, name: "Máy Tính" },
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
  // Check if item is already collected
  if (itemElement.classList.contains("collected")) {
    showDialogue("Đã lấy hết đồ ở kệ này rồi!");
    return;
  }

  // Get current count
  const countDisplay = itemElement.querySelector(".item-count");
  let currentCount = parseInt(countDisplay.textContent.replace("x", ""));

  if (currentCount > 0) {
    // Reduce count
    currentCount--;
    countDisplay.textContent = currentCount > 0 ? `x${currentCount}` : "Hết";

    // Add to inventory and essential count
    gameState.inventory.push(itemType);
    gameState.essentialItems++;
    const essentialDisplay = document.getElementById("essential-items");
    if (essentialDisplay)
      essentialDisplay.textContent = String(gameState.essentialItems);
    gameState.score += 10;
    updateScoreDisplay();

    // Show message
    showDialogue(`Đã nhặt ${getItemName(itemType)}!`);
    audioSystem.playSound("collect");

    // Mark as collected if no more items
    if (currentCount === 0) {
      itemElement.classList.add("collected");
      itemElement.style.opacity = "0.5";
    }

    // Win condition: 20 essential items collected
    if (gameState.essentialItems >= 10) {
      clearInterval(gameTimer);
      audioSystem.playSound("success");
      showDialogue("Tốt rồi, mình đã có đủ đồ để trú bão an toàn!");
      setTimeout(() => {
        initializeScreen2();
        showScreen("screen2");
        gameState.currentScreenNumber = 2;
      }, 1500);
    }
  } else {
    showDialogue("Kệ này đã hết đồ!");
    audioSystem.playSound("error");
  }
}

function interactWithItem(itemElement, itemType) {
  const itemName = itemElement.dataset.itemName;

  if (itemType === "electrical-panel") {
    if (!gameState.mainPowerOff) {
      showDialogue(
        "Đã tắt cầu dao điện! Bây giờ có thể an toàn rút các thiết bị khác."
      );
      itemElement.style.background = "#95a5a6"; // Gray out
      gameState.mainPowerOff = true;
      gameState.score += 10;
      updateScoreDisplay();
      audioSystem.playSound("success");
    }
  } else if (itemType === "fan") {
    if (!gameState.mainPowerOff) {
      failScreen2("Bạn bị giật điện vì chưa tắt cầu dao tổng!");
      return;
    }
    showDialogue("Đã rút phích máy quạt!");
    itemElement.style.display = "none";
    gameState.score += 10;
    updateScoreDisplay();
    audioSystem.playSound("collect");
  } else if (itemType === "tv" || itemType === "pc") {
    if (!gameState.mainPowerOff) {
      failScreen2("Không an toàn! Hãy tắt cầu dao điện trước.");
      return;
    }
    showDialogue(`Đã rút điện ${itemName}!`);
    itemElement.style.display = "none";
    gameState.score += 10;
    updateScoreDisplay();
    audioSystem.playSound("collect");
  } else if (itemType === "circuit-breaker") {
    // circuit breaker acts as a shortcut to main power
    if (!gameState.mainPowerOff) {
      gameState.mainPowerOff = true;
      itemElement.style.background = "#95a5a6";
      showDialogue("Đã gạt cầu dao góc phòng xuống. Điện đã được ngắt!");
      audioSystem.playSound("success");
    }
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

function failScreen2(message) {
  showDialogue(message || "Bạn chưa chuẩn bị đúng cách!");
  audioSystem.playSound("error");
  setTimeout(() => {
    initializeScreen2();
    showScreen("screen2");
  }, 1500);
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
    { type: "bed", x: 2, y: 3, width: 2, height: 1, name: "Giường an toàn" },
    { type: "water", x: 7, y: 2, name: "Bình nước dự trữ" },
    { type: "phone", x: 4, y: 4, name: "Điện thoại liên lạc khẩn cấp" },
    { type: "whistle", x: 5, y: 4, name: "Còi phát tín hiệu" },
    { type: "flashlight", x: 3, y: 2, name: "Đèn pin" },
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
    gameState.hasPhone = true;
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
    phoneDisplay.textContent = "0";
  });

  callBtn.addEventListener("click", () => {
    if (
      phoneNumber === "114" ||
      phoneNumber === "115" ||
      phoneNumber === "113"
    ) {
      showDialogue(
        "Đã gọi cầu cứu thành công! Chuyển sang màn liên lạc cứu hộ."
      );
      gameState.phoneCalled = true;
      hidePhoneInterface();
      audioSystem.playSound("phone");
      setTimeout(() => {
        const title = document.getElementById("screen4-title");
        const msg = document.getElementById("screen4-message");
        if (title && msg) {
          title.textContent = "CHÚC MỪNG BẠN ĐÃ VƯỢT QUA CƠN BÃO";
          msg.textContent = "Liên lạc thành công. Nhấn Tiếp tục để xem ENDING.";
        }
        showScreen("screen4");
      }, 1500);
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
  const dialogueBox = document.querySelector(".dialogue-box");
  const dialogueText = document.querySelector(".dialogue-text");

  if (dialogueBox && dialogueText) {
    // Show the dialogue box if it was hidden
    dialogueBox.classList.remove("hidden");
    dialogueText.textContent = text;

    // Clear any existing click handler
    dialogueBox.removeEventListener("click", hideDialogue);

    // Add click handler to hide dialogue
    dialogueBox.addEventListener("click", hideDialogue);

    // Auto-hide dialogue after 5 seconds
    clearTimeout(gameState.dialogueTimer);
    gameState.dialogueTimer = setTimeout(() => {
      hideDialogue();
    }, 5000);
  }
}

function hideDialogue() {
  const dialogueBox = document.querySelector(".dialogue-box");
  if (dialogueBox) {
    dialogueBox.classList.add("hidden");
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
      } else if (gameState.currentScreenNumber === 2) {
        // When screen 2 runs out of time, go to screen 3
        initializeScreen3();
        showScreen("screen3");
        gameState.currentScreenNumber = 3;
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
