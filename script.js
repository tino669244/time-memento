// RuineTime Off - JavaScript Logic

// Application state
let birthDate = null;
let lifeExpectancy = 80;
let updateInterval = null;

// DOM elements
const birthdateInput = document.getElementById('birthdate');
const lifeExpectancySlider = document.getElementById('lifeExpectancy');
const lifeExpectancyValue = document.getElementById('lifeExpectancyValue');
const welcomeCard = document.getElementById('welcomeCard');
const mainContent = document.getElementById('mainContent');

// Age display
const currentAgeElement = document.getElementById('currentAge');

// Lived time elements
const livedYearsElement = document.getElementById('livedYears');
const livedDaysElement = document.getElementById('livedDays');
const livedHoursElement = document.getElementById('livedHours');
const livedMinutesElement = document.getElementById('livedMinutes');
const livedSecondsElement = document.getElementById('livedSeconds');

// Statistical elements
const statisticalPercentElement = document.getElementById('statisticalPercent');
const progressFillElement = document.getElementById('progressFill');
const lifeExpectancyDisplayElements = [
    document.getElementById('lifeExpectancyDisplay'),
    document.getElementById('lifeExpectancyRemaining')
];

// Remaining time elements
const remainingCard = document.getElementById('remainingCard');
const remainingYearsElement = document.getElementById('remainingYears');
const remainingDaysElement = document.getElementById('remainingDays');
const remainingHoursElement = document.getElementById('remainingHours');
const remainingMinutesElement = document.getElementById('remainingMinutes');
const remainingSecondsElement = document.getElementById('remainingSeconds');

// Event listeners
birthdateInput.addEventListener('change', handleBirthdateChange);
lifeExpectancySlider.addEventListener('input', handleLifeExpectancyChange);

// Initialize the application
function init() {
    // Set initial life expectancy display
    lifeExpectancyValue.textContent = lifeExpectancy;
    updateLifeExpectancyDisplay();
    
    // Check if there's a saved birthdate in localStorage
    const savedBirthdate = localStorage.getItem('ruinetime-birthdate');
    const savedLifeExpectancy = localStorage.getItem('ruinetime-life-expectancy');
    
    if (savedBirthdate) {
        birthdateInput.value = savedBirthdate;
        birthDate = new Date(savedBirthdate);
        showMainContent();
        startTimeUpdates();
    }
    
    if (savedLifeExpectancy) {
        lifeExpectancy = parseInt(savedLifeExpectancy);
        lifeExpectancySlider.value = lifeExpectancy;
        lifeExpectancyValue.textContent = lifeExpectancy;
        updateLifeExpectancyDisplay();
    }
}

// Handle birthdate change
function handleBirthdateChange(event) {
    const dateValue = event.target.value;
    
    if (dateValue) {
        birthDate = new Date(dateValue);
        
        // Validate that birthdate is not in the future
        if (birthDate > new Date()) {
            alert('La date de naissance ne peut pas être dans le futur !');
            birthdateInput.value = '';
            birthDate = null;
            showWelcomeCard();
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('ruinetime-birthdate', dateValue);
        
        showMainContent();
        startTimeUpdates();
    } else {
        birthDate = null;
        localStorage.removeItem('ruinetime-birthdate');
        showWelcomeCard();
        stopTimeUpdates();
    }
}

// Handle life expectancy change
function handleLifeExpectancyChange(event) {
    lifeExpectancy = parseInt(event.target.value);
    lifeExpectancyValue.textContent = lifeExpectancy;
    updateLifeExpectancyDisplay();
    
    // Save to localStorage
    localStorage.setItem('ruinetime-life-expectancy', lifeExpectancy);
    
    // Update calculations if birthdate is set
    if (birthDate) {
        updateTimeDisplay();
    }
}

// Show welcome card
function showWelcomeCard() {
    welcomeCard.style.display = 'block';
    mainContent.style.display = 'none';
}

// Show main content
function showMainContent() {
    welcomeCard.style.display = 'none';
    mainContent.style.display = 'block';
}

// Update life expectancy display in multiple places
function updateLifeExpectancyDisplay() {
    lifeExpectancyDisplayElements.forEach(element => {
        if (element) {
            element.textContent = lifeExpectancy;
        }
    });
}

// Start time updates
function startTimeUpdates() {
    // Clear any existing interval first
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
    
    // Update immediately
    updateTimeDisplay();
    
    // Update every second
    updateInterval = setInterval(updateTimeDisplay, 1000);
}

// Stop time updates
function stopTimeUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

// Calculate time values
function calculateTimeValues() {
    if (!birthDate) {
        return null;
    }
    
    const now = new Date().getTime();
    const birth = birthDate.getTime();
    const livedMs = now - birth;
    
    // Calculate real age
    const ageInYears = livedMs / (365.25 * 24 * 60 * 60 * 1000);
    
    // Calculate lived time units (REAL TIME)
    const livedSeconds = Math.floor(livedMs / 1000);
    const livedMinutes = Math.floor(livedMs / (1000 * 60));
    const livedHours = Math.floor(livedMs / (1000 * 60 * 60));
    const livedDays = Math.floor(livedMs / (1000 * 60 * 60 * 24));
    const livedYears = Math.floor(ageInYears);
    
    // Statistical remaining (not a countdown, just statistical estimation)
    const statisticalRemainingYears = Math.max(0, lifeExpectancy - ageInYears);
    const statisticalRemainingMs = statisticalRemainingYears * 365.25 * 24 * 60 * 60 * 1000;
    
    const statisticalRemainingSeconds = Math.floor(statisticalRemainingMs / 1000);
    const statisticalRemainingMinutes = Math.floor(statisticalRemainingMs / (1000 * 60));
    const statisticalRemainingHours = Math.floor(statisticalRemainingMs / (1000 * 60 * 60));
    const statisticalRemainingDays = Math.floor(statisticalRemainingMs / (1000 * 60 * 60 * 24));
    
    // Statistical percentage (not absolute)
    const statisticalPercent = lifeExpectancy > 0 ? Math.min(100, (ageInYears / lifeExpectancy) * 100) : 0;
    
    return {
        ageInYears,
        livedTime: {
            years: livedYears,
            days: livedDays,
            hours: livedHours,
            minutes: livedMinutes,
            seconds: livedSeconds
        },
        statisticalRemaining: {
            years: Math.floor(statisticalRemainingYears),
            days: statisticalRemainingDays,
            hours: statisticalRemainingHours,
            minutes: statisticalRemainingMinutes,
            seconds: statisticalRemainingSeconds
        },
        statisticalPercent: Math.max(0, statisticalPercent)
    };
}

// Format number with French locale
function formatNumber(number) {
    return number.toLocaleString('fr-FR');
}

// Add updating animation to element
function addUpdatingAnimation(element) {
    element.classList.add('updating');
    setTimeout(() => {
        element.classList.remove('updating');
    }, 500);
}

// Update time display
function updateTimeDisplay() {
    const calculations = calculateTimeValues();
    
    if (!calculations) {
        return;
    }
    
    // Update current age
    if (currentAgeElement) {
        const newAge = calculations.ageInYears.toFixed(8) + ' ans';
        if (currentAgeElement.textContent !== newAge) {
            currentAgeElement.textContent = newAge;
            addUpdatingAnimation(currentAgeElement);
        }
    }
    
    // Update lived time
    updateElementValue(livedYearsElement, formatNumber(calculations.livedTime.years));
    updateElementValue(livedDaysElement, formatNumber(calculations.livedTime.days));
    updateElementValue(livedHoursElement, formatNumber(calculations.livedTime.hours));
    updateElementValue(livedMinutesElement, formatNumber(calculations.livedTime.minutes));
    updateElementValue(livedSecondsElement, formatNumber(calculations.livedTime.seconds));
    
    // Update statistical progress
    const percentText = calculations.statisticalPercent.toFixed(1) + '%';
    if (statisticalPercentElement && statisticalPercentElement.textContent !== percentText) {
        statisticalPercentElement.textContent = percentText;
    }
    
    if (progressFillElement) {
        const progressWidth = Math.min(100, calculations.statisticalPercent) + '%';
        progressFillElement.style.width = progressWidth;
    }
    
    // Update remaining time (only if not exceeding life expectancy)
    if (calculations.statisticalPercent < 100) {
        if (remainingCard) {
            remainingCard.style.display = 'block';
        }
        
        updateElementValue(remainingYearsElement, formatNumber(calculations.statisticalRemaining.years), true);
        updateElementValue(remainingDaysElement, formatNumber(calculations.statisticalRemaining.days), true);
        updateElementValue(remainingHoursElement, formatNumber(calculations.statisticalRemaining.hours), true);
        updateElementValue(remainingMinutesElement, formatNumber(calculations.statisticalRemaining.minutes), true);
        updateElementValue(remainingSecondsElement, formatNumber(calculations.statisticalRemaining.seconds), true);
    } else {
        // Hide remaining card when statistical percent reaches or exceeds 100%
        if (remainingCard) {
            remainingCard.style.display = 'none';
        }
    }
}

// Update element value with animation
function updateElementValue(element, newValue, isRemaining = false) {
    if (element && element.textContent !== newValue) {
        element.textContent = newValue;
        if (!isRemaining) {
            addUpdatingAnimation(element);
        }
    }
}

// Handle page visibility change (pause/resume updates when tab is not visible)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopTimeUpdates();
    } else if (birthDate) {
        startTimeUpdates();
    }
});

// Handle page unload (cleanup)
window.addEventListener('beforeunload', function() {
    stopTimeUpdates();
});

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Press 'R' to reset
    if (event.key === 'r' || event.key === 'R') {
        if (event.ctrlKey || event.metaKey) {
            return; // Don't interfere with browser refresh
        }
        
        if (confirm('Voulez-vous vraiment réinitialiser l\'application ?')) {
            localStorage.removeItem('ruinetime-birthdate');
            localStorage.removeItem('ruinetime-life-expectancy');
            location.reload();
        }
    }
    
    // Press Escape to clear birthdate
    if (event.key === 'Escape') {
        if (birthDate) {
            if (confirm('Voulez-vous effacer la date de naissance ?')) {
                birthdateInput.value = '';
                handleBirthdateChange({ target: { value: '' } });
            }
        }
    }
});

// Console welcome message
console.log(`
🕒💀 RuineTime Off - Time Memento Life Chronometer 💀🕒

Application de chronométrage de vie en temps réel.
Créé par Tinoruine.

Rappel: Le temps est précieux, profitez de chaque instant !

Raccourcis clavier:
- R: Réinitialiser l'application
- Escape: Effacer la date de naissance
`);

// Export functions for potential external use
window.RuineTimeOff = {
    calculateTimeValues,
    formatNumber,
    updateTimeDisplay,
    reset: function() {
        localStorage.clear();
        location.reload();
    }
};