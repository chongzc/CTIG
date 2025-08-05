// Comic Navigation and Game Management System

// Game progress tracking
const gameProgress = {
    hacking: false,
    maze: false
};

// Current page tracking
let currentPage = 1;
const totalPages = 7;

// Game configurations - now using config file
const gameConfig = COMIC_CONFIG.games;

// Initialize the comic system
document.addEventListener('DOMContentLoaded', function() {
    initializeComic();
    setupEventListeners();
});

function initializeComic() {
    // Show first page
    showPage(1);
    
    // Apply button positions from config
    applyButtonPositions();
    
    // Update navigation buttons for initial page
    updateNavigationButtons();
    
    // Setup overlay button event listeners
    document.querySelectorAll('.overlay-button').forEach(button => {
        button.addEventListener('click', function() {
            const gameType = this.getAttribute('data-game');
            const pageNumber = parseInt(this.getAttribute('data-page'));
            startGame(gameType, pageNumber);
        });
    });
}

function setupEventListeners() {
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextPage();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousPage();
        } else if (e.key === 'Escape') {
            closeGame();
        }
    });
}

// Page Navigation Functions
function showPage(pageNumber) {
    // Hide all pages
    document.querySelectorAll('.comic-page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(`comic-page-${pageNumber}`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageNumber;
        
        // Update navigation buttons based on page content
        updateNavigationButtons();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        // Check if we need to complete a game before proceeding
        if (currentPage === 1 && !gameProgress.hacking) {
            showGameProgressModal("You need to complete the hacking game first!");
            return;
        }
        if (currentPage === 3 && !gameProgress.maze) {
            showGameProgressModal("You need to complete the maze game first!");
            return;
        }
        
        showPage(currentPage + 1);
    }
}

// Function to check if current page has a game
function hasGameOnPage(pageNumber) {
    const gameButton = document.querySelector(`#comic-page-${pageNumber} .overlay-button`);
    return gameButton !== null;
}

// Function to update navigation buttons based on page content
function updateNavigationButtons() {
    const currentPageElement = document.getElementById(`comic-page-${currentPage}`);
    if (!currentPageElement) return;
    
    const navButtons = currentPageElement.querySelectorAll('.nav-button');
    const gameButton = currentPageElement.querySelector('.overlay-button');
    
    // Check if current page has a game and if it's completed
    const hasGame = gameButton !== null;
    const isGameCompleted = (currentPage === 1 && gameProgress.hacking) || 
                           (currentPage === 3 && gameProgress.maze);
    
    navButtons.forEach(button => {
        if (button.textContent.includes('Next Page')) {
            if (hasGame && !isGameCompleted) {
                // Hide "Next Page" button if game is not completed
                button.style.display = 'none';
            } else {
                // Show "Next Page" button if no game or game is completed
                button.style.display = 'block';
            }
        }
    });
}

function previousPage() {
    if (currentPage > 1) {
        showPage(currentPage - 1);
    }
}

// Game Management Functions
function startGame(gameType, pageNumber) {
    const game = gameConfig[gameType];
    if (!game) {
        console.error('Unknown game type:', gameType);
        return;
    }
    
    // Set game title
    document.getElementById('game-title').textContent = game.title;
    
    // Load game content
    loadGameContent(game.file, gameType);
    
    // Show game container
    document.getElementById('game-container').classList.add('active');
}

function loadGameContent(gameFile, gameType) {
    const gameContent = document.getElementById('game-content');
    
    if (gameType === 'hacking') {
        // Load hacking game as iframe
        gameContent.innerHTML = `
            <iframe src="${gameFile}" class="game-frame" 
                    onload="setupHackingGame()"></iframe>
        `;
    } else if (gameType === 'maze') {
        // Load maze game as iframe
        gameContent.innerHTML = `
            <iframe src="${gameFile}" class="game-frame" 
                    onload="setupMazeGame()"></iframe>
        `;
    }
}

function setupHackingGame() {
    // Setup communication with hacking game iframe
    const iframe = document.querySelector('.game-frame');
    if (iframe && iframe.contentWindow) {
        // Listen for game completion message from iframe
        window.addEventListener('message', function(event) {
            if (event.data.type === 'gameComplete' && event.data.game === 'hacking') {
                completeGame('hacking');
            }
        });
    }
}

function setupMazeGame() {
    // Setup communication with maze game iframe
    const iframe = document.querySelector('.game-frame');
    if (iframe && iframe.contentWindow) {
        // Listen for game completion message from iframe
        window.addEventListener('message', function(event) {
            if (event.data.type === 'gameComplete' && event.data.game === 'maze') {
                completeGame('maze');
            }
        });
    }
}

function completeGame(gameType) {
    gameProgress[gameType] = true;
    
    // Close game
    closeGame();
    
    // Update navigation buttons to show "Next Page" button now that game is completed
    updateNavigationButtons();
    
    // Auto-advance to next page if appropriate
    const gameSettings = gameConfig[gameType];
    if (gameSettings && gameSettings.autoAdvanceDelay && currentPage === gameSettings.requiredPage) {
        setTimeout(() => {
            nextPage();
        }, gameSettings.autoAdvanceDelay);
    }
}

function closeGame() {
    document.getElementById('game-container').classList.remove('active');
    document.getElementById('game-content').innerHTML = '';
}

// Modal Functions
function showGameProgressModal(message) {
    document.getElementById('modal-message').textContent = message;
    document.getElementById('game-progress-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('game-progress-modal').style.display = 'none';
    
    // Update navigation buttons after modal is closed
    // This ensures "Next Page" button is visible if game was completed
    updateNavigationButtons();
}

// Utility Functions for Game Communication
function sendMessageToGame(gameType, message) {
    const iframe = document.querySelector('.game-frame');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
            type: 'fromComic',
            game: gameType,
            ...message
        }, '*');
    }
}

// Easy coordinate adjustment function for overlay buttons
function adjustButtonPosition(buttonSelector, top, left) {
    const button = document.querySelector(buttonSelector);
    if (button) {
        button.style.top = top + 'px';
        button.style.left = left + '%';
    }
}

// Example usage for easy button positioning:
// adjustButtonPosition('.overlay-button[data-game="hacking"]', 250, 65);
// adjustButtonPosition('.overlay-button[data-game="kill-monster"]', 350, 45);

// Export functions for global access
window.nextPage = nextPage;
window.previousPage = previousPage;
window.closeGame = closeGame;
window.closeModal = closeModal;
window.adjustButtonPosition = adjustButtonPosition;

// Debug function to check current state
window.debugState = function() {
    console.log('Current Page:', currentPage);
    console.log('Game Progress:', gameProgress);
    console.log('Has Game on Current Page:', hasGameOnPage(currentPage));
    
    const hasGame = hasGameOnPage(currentPage);
    const isGameCompleted = (currentPage === 1 && gameProgress.hacking) || 
                           (currentPage === 3 && gameProgress.maze);
    
    console.log('Is Game Completed:', isGameCompleted);
    console.log('Next Page Button Should Show:', !hasGame || isGameCompleted);
    console.log('Can Proceed to Next Page:', currentPage < totalPages && 
        !(currentPage === 1 && !gameProgress.hacking) && 
        !(currentPage === 3 && !gameProgress.maze));
}; 