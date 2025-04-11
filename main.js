let ions = 0;
let ionsPerSec = 0;
let ionPerClick = 1;
let totalIons = 0;
let coherencePoints = 0;
let currentClass = null;

let upgrades = {
    clickPower: { level: 0, baseCost: 10 },
    autoCollector: { level: 0, baseCost: 100, ionPerSec: 1 },
    entangle: { level: 0, baseCost: 1000 },
};
// DOM
const ionDisplay = document.getElementById("ions")
const ionPerSecDisplay = document.getElementById("ionsPerSec");
const ionButton = document.getElementById("ion-zapper")
const prestigeUI = document.getElementById("prestige-ui");
const prestigeButton = document.getElementById("prestige-button");
const coherenceDisplay = document.getElementById("coherence-points");
const classSelection = document.getElementById("class-selection");
const classButtons = document.querySelectorAll(".class-btn");
const upgradeButton = document.getElementById("upgrade-button");
const upgradeClickPower = document.getElementById("upgrade-click");
const upgradeAutoCollector = document.getElementById("upgrade-auto");
const upgradeEntangle = document.getElementById("upgrade-entangle");

// UI Update

function updateUI() {
    ionDisplay.textContent = ions.toFixed(1);
    ionPerSecDisplay.textContent = ionsPerSec.toFixed(1);
    upgradeClickPower.textContent = `Upgrade Click Power (Lvl ${upgrades.clickPower.level}) - Cost: ${getUpgradeCost('clickPower')}`;
    upgradeAutoCollector.textContent = `Auto Collector (Lvl ${upgrades.autoCollector.level}) - Cost: ${getUpgradeCost('autoCollector')}`;
    upgradeEntangle.textContent = `Entangle (Lvl ${upgrades.entangle.level}) - cost: ${getUpgradeCost('entangle')}`;
}


// Cost Calc
function getUpgradeCost(type) {
    const upgrade = upgrades[type];
    return Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level));
}

// Click Events

ionButton.addEventListener("click", () => {
    ions += ionPerClick;
    updateUI();   
});

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
        ionsPerSec = upgrades.autoCollector.level;
        updateUI();
    }
});

upgradeEntangle.addEventListener("click", () => {
    const cost = getUpgradeCost('entangle');
    if (ions >= cost) {
        ions -= cost;
        upgrades.entangle.level++;
        upgrades.autoCollector.ionPerSec++;
        updateUI();

    }
});

setInterval(() => {
    if (upgrades.autoCollector.level > 0) {
        const passive = upgrades.autoCollector.level * upgrades.autoCollector.ionPerSec;
        ions += passive;
        updateUI();
    }
}, 1000);


updateUI();
