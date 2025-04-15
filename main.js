let ions = 0;
let ionsPerSec = 0;
let ionPerClick = 1;
let totalIons = 0;
let coherencePoints = 0;
let baseCoherenceCost = 2000;
let coherenceCostMultiplier = 1.5;


// DOM
const ionDisplay = document.getElementById("ions");
const ionPerSecDisplay = document.getElementById("ionsPerSec");
const ionButton = document.getElementById("ion-zapper");
const coherenceSection = document.getElementById("coherence-section");
const coherenceDisplay = document.getElementById("coherence-points");
const coherenceGain = document.getElementById("coherence-gain");
const coherenceNext = document.getElementById("coherence-next");
const DecoherenceButton = document.getElementById("decoherence-button");

const upgradeClickPower = document.getElementById("upgrade-click");
const upgradeAutoCollector = document.getElementById("upgrade-auto");
const upgradeEntangle = document.getElementById("upgrade-entangle");

const introScreen = document.getElementById("intro-screen");
const gameScreen = document.getElementById("game-screen");
const startButton = document.getElementById("start-button");

// UI Updates
function updateUI() {
  ionDisplay.textContent = ions.toFixed(1);
  ionPerSecDisplay.textContent = ionsPerSec.toFixed(1);
  upgradeClickPower.textContent = `Upgrade Click Power (Lvl ${upgrades.clickPower.level}) - Cost: ${getUpgradeCost('clickPower')}`;
  upgradeAutoCollector.textContent = `Auto Collector (Lvl ${upgrades.autoCollector.level}) - Cost: ${getUpgradeCost('autoCollector')}`;
  upgradeEntangle.textContent = `Entangle (Lvl ${upgrades.entangle.level}) - Cost: ${getUpgradeCost('entangle')}`;
}

function updateCoherenceUI() {
  coherenceDisplay.textContent = coherencePoints;
  coherenceGain.textContent = calculateCoherenceGain();
  coherenceNext.textContent = nextCoherenceUpgrade();

  checkCoherenceMilestones();
}

// Utility
function getUpgradeCost(type) {
  const upgrade = upgrades[type];
  return Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level));
}

function nextCoherenceUpgrade() {
    return Math.floor(baseCoherenceCost * Math.pow(coherenceCostMultiplier, coherencePoints));
}

function calculateCoherenceGain() {
  return Math.floor(ions / nextCoherenceUpgrade());
}

function recalculateIonsPerSec() {
    ionsPerSec = upgrades.autoCollector.level * upgrades.autoCollector.ionPerSec;
}

// Game Start
startButton.addEventListener("click", () => {
  introScreen.style.display = "none";
  gameScreen.classList.remove("hidden");
});

// Clicking
ionButton.addEventListener("click", () => {
  ions += ionPerClick;
  maybeShowCoherence();
  updateUI();
});

// TIER 1 Upgrades
let upgrades = {
    clickPower: { level: 0, baseCost: 10 },
    autoCollector: { level: 0, baseCost: 100, ionPerSec: 1 },
    entangle: { level: 0, baseCost: 1000 },
  };

upgradeClickPower.addEventListener("click", () => {
  const cost = getUpgradeCost('clickPower');
  if (ions >= cost) {
    ions -= cost;
    upgrades.clickPower.level++;
    ionPerClick += 1;
    updateUI();
  }
});

upgradeAutoCollector.addEventListener("click", () => {
  const cost = getUpgradeCost('autoCollector');
  if (ions >= cost) {
    ions -= cost;
    upgrades.autoCollector.level++;
    ionsPerSec = upgrades.autoCollector.level * upgrades.autoCollector.ionPerSec;
    updateUI();
  }
});

upgradeEntangle.addEventListener("click", () => {
  const cost = getUpgradeCost('entangle');
  if (ions >= cost) {
    ions -= cost;
    upgrades.entangle.level++;
    upgrades.autoCollector.ionPerSec += 1;
    ionsPerSec = upgrades.autoCollector.level * upgrades.autoCollector.ionPerSec;
    updateUI();
  }
});

// Passive Generation
setInterval(() => {
  if (ionsPerSec > 0) {
    ions += ionsPerSec;
    maybeShowCoherence();
    updateUI();
  }
}, 1000);

// Coherence Unlock Logic
function maybeShowCoherence() {
  if (ions >= baseCoherenceCost && coherenceSection.classList.contains("hidden")) {
    coherenceSection.classList.remove("hidden");
  }
}

// Decoherence Button
DecoherenceButton.addEventListener("click", () => {
  const gain = calculateCoherenceGain();
  if (ions >= nextCoherenceUpgrade()) {
    coherencePoints += gain;
    ions = 0;
    ionPerClick = 1;
    ionsPerSec = 0;
    upgrades = {
      clickPower: { level: 0, baseCost: 10 },
      autoCollector: { level: 0, baseCost: 100, ionPerSec: 1 },
      entangle: { level: 0, baseCost: 1000 },
    };
    updateUI();
    updateCoherenceUI();
  }
});

// TIER 2 Upgrades
let coherenceMilestones = [
    {
    threshold: 2,
    unlocked: false,
    description: "Upgrade 1",
    effect: function() {}
},
    {
    threshold: 5,
    unlocked: false,
    description: "Upgrade 2",
    effect: function() {}
},
    {
    threshold: 8,
    unlocked: false,
    description: "Upgrade 3",
    effect: function() {}
    }];

function checkCoherenceMilestones() {
    coherenceMilestones.foreach(milestone => {
        if (!milestone.unlocked && coherencePoints >= milestone.threshold) {
            milestone.unlocked = true;
            minestone.effect();
        }
    })
}

let coherenceUpgrades = [
    {
    name: "U1",
    cost: 1,
    purchased: false,
    description: "TBD",
    effect: function() {
        ionsPerSec += 1000
    }
},
    {
    name: "U2",
    cost: 3,
    purchased: false,
    description: "TBD",
    effect: function() {}
},
    {
    name: "U3",
    cost: 7,
    purchased: false,
    description: "TBD",
    effect: function() {}
}];

document.getElementById("coh-upgrade-0").addEventListener("click", () => buyCoherenceUpgrade(0));
document.getElementById("coh-upgrade-1").addEventListener("click", () => buyCoherenceUpgrade(1));
document.getElementById("coh-upgrade-2").addEventListener("click", () => buyCoherenceUpgrade(2));

function buyCoherenceUpgrade(index) {
    const upgrade = coherenceUpgrades[index];
    if (!upgrade.purchased && coherencePoints >= upgrade.cost) {
        coherencePoints -= upgrade.cost;
        upgrade.purchased = true;
        upgrade.effect();
        updateCoherenceUI();
        updateUI();
    }
}

// Update Coherence Info Every Second
setInterval(() => {
  updateCoherenceUI();
}, 1000);

//  Save / Load 
function saveGame() {
  const saveData = {
    ions,
    ionPerClick,
    totalIons,
    ionsPerSec,
    coherencePoints,
    upgrades,
    coherenceMilestones,
    coherenceUpgrades
  };
  localStorage.setItem("quantumIdleSave", JSON.stringify(saveData));
}

function loadGame() {
  const savedData = JSON.parse(localStorage.getItem("quantumIdleSave"));
  if (savedData) {
    ions = savedData.ions;
    ionPerClick = savedData.ionPerClick;
    totalIons = savedData.totalIons;
    ionsPerSec = savedData.ionsPerSec;
    coherencePoints = savedData.coherencePoints;
    upgrades = savedData.upgrades;
    updateUI();
    updateCoherenceUI();
    maybeShowCoherence();
    if (savedData.coherenceMilestones) {
        coherenceMilestones = savedData.coherenceMilestones;
    }
    if (savedData. coherenceUpgrades) {
        coherenceUpgrades = savedData.coherenceUpgrades;
    }
  }
}

function resetGame() {
  localStorage.removeItem("quantumIdleSave");
  location.reload();
}

window.addEventListener("load", () => {
  loadGame();
});

updateUI();
updateCoherenceUI();
