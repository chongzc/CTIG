const gameProgress = {
    fpsmonster: false,
    hacking: false,
    sound: false,
    clue: false,
    electric: false,
    maze: false
};

let currentPage = 1;
const totalPages = 19;

const gameConfig = COMIC_CONFIG.games;

document.addEventListener('DOMContentLoaded', function() {
    initializeComic();
    setupEventListeners();
});

function initializeComic() {
    showPage(1);
    applyButtonPositions();
    updateNavigationButtons();
    document.querySelectorAll('.overlay-button').forEach(button => {
        button.addEventListener('click', function() {
            const gameType = this.getAttribute('data-game');
            const pageNumber = parseInt(this.getAttribute('data-page'));
            startGame(gameType, pageNumber);
        });
    });
}

function setupEventListeners() {
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
    window.addEventListener('message', function(event) {
        if (event.data.type === 'navigate' && event.data.action === 'nextPage') {
            nextPage();
        }
    });
}

function showPage(pageNumber) {
    document.querySelectorAll('.comic-page').forEach(page => {
        page.classList.remove('active');
    });
    const targetPage = document.getElementById(`comic-page-${pageNumber}`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageNumber;
        updateNavigationButtons();
    }
}

function nextPage() {
    if (currentPage === 15) {
        showPage(16);
        return;
    }
    if (currentPage === 5 && !gameProgress.maze) {
        showGameProgressModal("You need to complete the Maze game first!");
        return;
    }
    if (currentPage === 9 && !gameProgress.fpsmonster) {
        showGameProgressModal("You need to complete the FPS Monster game first!");
        return;
    }
    if (currentPage === 11 && !gameProgress.hacking) {
        showGameProgressModal("You need to complete the Hacking game first!");
        return;
    }
    if (currentPage === 12 && !gameProgress.sound) {
        showGameProgressModal("You need to complete the Sound game first!");
        return;
    }
    if (currentPage === 13 && !gameProgress.clue) {
        showGameProgressModal("You need to complete the Clue game first!");
        return;
    }
    if (currentPage === 14 && !gameProgress.electric) {
        showGameProgressModal("You need to complete the Electric game first!");
        return;
    }
    if (currentPage < totalPages) {
        showPage(currentPage + 1);
    }
}

function hasGameOnPage(pageNumber) {
    const gameButton = document.querySelector(`#comic-page-${pageNumber} .overlay-button`);
    return gameButton !== null;
}

function updateNavigationButtons() {
    const currentPageElement = document.getElementById(`comic-page-${currentPage}`);
    if (!currentPageElement) return;
    
    const navButtons = currentPageElement.querySelectorAll('.nav-button');
    const gameButton = currentPageElement.querySelector('.overlay-button');
    
    const hasGame = gameButton !== null;
    let isGameCompleted = true;
    const pageGameMap = {
        5: 'maze',
        9: 'fpsmonster',
        11: 'hacking',
        12: 'sound',
        13: 'clue',
        14: 'electric'
    };
    if (hasGame && pageGameMap[currentPage]) {
        isGameCompleted = gameProgress[pageGameMap[currentPage]];
    }

    navButtons.forEach(button => {
        if (button.textContent.includes('Next Page')) {
            if (hasGame && !isGameCompleted) {
                button.style.display = 'none';
            } else {
                button.style.display = 'block';
            }
        }
    });
}

function previousPage() {
    if (currentPage === 16) {
        showPage(15);
        return;
    }
    if (currentPage > 1) {
        showPage(currentPage - 1);
    }
}

function startGame(gameType, pageNumber) {
    const game = gameConfig[gameType];
    if (!game) {
        console.error('Unknown game type:', gameType);
        return;
    }
    
    document.getElementById('game-title').textContent = game.title;
    loadGameContent(game.file, gameType);
    document.getElementById('game-container').classList.add('active');
}

function loadGameContent(gameFile, gameType) {
    const gameContent = document.getElementById('game-content');
    window.removeMazeListener && window.removeMazeListener();
    window.removeMazeListener = undefined;
    let setupFn = '';
    switch (gameType) {
        case 'fpsmonster': setupFn = 'setupFPSMonsterGame'; break;
        case 'hacking': setupFn = 'setupHackingGame'; break;
        case 'sound': setupFn = 'setupSoundGame'; break;
        case 'clue': setupFn = 'setupClueGame'; break;
        case 'electric': setupFn = 'setupElectricGame'; break;
        case 'maze': setupFn = 'setupMazeGame'; break;
        default: setupFn = '';
    }
    gameContent.innerHTML = `<iframe src="${gameFile}" class="game-frame"></iframe>`;
    if (setupFn && typeof window[setupFn] === 'function') {
        setTimeout(() => window[setupFn](), 100);
    }
}

function setupMazeGame() {
    const iframe = document.querySelector('.game-frame');
    if (iframe && iframe.contentWindow) {
        function mazeListener(event) {
            if (event.data && event.data.type === 'gameComplete' && event.data.game === 'maze') {
                completeGame('maze');
            }
        }
        window.addEventListener('message', mazeListener);
        window.removeMazeListener = () => window.removeEventListener('message', mazeListener);
    }
}

function setupFPSMonsterGame() {
    const iframe = document.querySelector('.game-frame');
    if (iframe && iframe.contentWindow) {
        window.addEventListener('message', function(event) {
            if (event.data.type === 'gameComplete' && event.data.game === 'fpsmonster') {
                completeGame('fpsmonster');
            }
        });
    }
}

function setupHackingGame() {
    const iframe = document.querySelector('.game-frame');
    if (iframe && iframe.contentWindow) {
        window.addEventListener('message', function(event) {
            if (event.data.type === 'gameComplete' && event.data.game === 'hacking') {
                completeGame('hacking');
            }
        });
    }
}

function setupSoundGame() {
    const iframe = document.querySelector('.game-frame');
    if (iframe && iframe.contentWindow) {
        window.addEventListener('message', function(event) {
            if (event.data.type === 'gameComplete' && event.data.game === 'sound') {
                completeGame('sound');
            }
        });
    }
}

function setupClueGame() {
    const iframe = document.querySelector('.game-frame');
    if (iframe && iframe.contentWindow) {
        window.addEventListener('message', function(event) {
            if (event.data.type === 'gameComplete' && event.data.game === 'clue') {
                completeGame('clue');
            }
        });
    }
}

function setupElectricGame() {
    const iframe = document.querySelector('.game-frame');
    if (iframe && iframe.contentWindow) {
        window.addEventListener('message', function(event) {
            if (event.data.type === 'gameComplete' && event.data.game === 'electric') {
                completeGame('electric');
            }
        });
    }
}

function completeGame(gameType) {
    gameProgress[gameType] = true;
    closeGame();
    updateNavigationButtons();
    const gameSettings = gameConfig[gameType];
    if (gameSettings && gameSettings.autoAdvanceDelay) {
        if (currentPage !== gameSettings.requiredPage) {
            showPage(gameSettings.requiredPage);
        }
        setTimeout(() => {
            nextPage();
        }, gameSettings.autoAdvanceDelay);
    }
}

function closeGame() {
    document.getElementById('game-container').classList.remove('active');
    document.getElementById('game-content').innerHTML = '';
}

function showGameProgressModal(message) {
    document.getElementById('modal-message').textContent = message;
    document.getElementById('game-progress-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('game-progress-modal').style.display = 'none';
    updateNavigationButtons();
}

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

function adjustButtonPosition(buttonSelector, top, left) {
    const button = document.querySelector(buttonSelector);
    if (button) {
        button.style.top = top + 'px';
        button.style.left = left + '%';
    }
}

window.nextPage = nextPage;
window.previousPage = previousPage;
window.closeGame = closeGame;
window.closeModal = closeModal;
window.adjustButtonPosition = adjustButtonPosition;

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