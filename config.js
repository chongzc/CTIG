// Comic Configuration File
// Easy to adjust settings without modifying main code

const COMIC_CONFIG = {
    // Button positions for easy adjustment
    buttonPositions: {
        fpsmonster: { top: 884, left: 87 },
        hacking: { top: 455, left: 53 },
        sound: { top: 750, left: 40 },
        clue: { top: 700, left: 60 },
        electric: { top: 750, left: 65 },
        maze: { top: 750, left: 60 },
        goo5next: { top: 400, left: 50 }, 
        screenback: { top: 600, left: 41 } 
    },

    // Game settings
    games: {
        fpsmonster: {
            title: "FPS Monster Game",
            file: "games/fps-monster-game.html",
            requiredPage: 9,
            autoAdvanceDelay: 2000
        },
        hacking: {
            title: "Hacking Challenge",
            file: "games/hacking.html",
            requiredPage: 11,
            autoAdvanceDelay: 2000
        },
        sound: {
            title: "Sound Game",
            file: "games/sound.html",
            requiredPage: 12,
            autoAdvanceDelay: 2000
        },
        clue: {
            title: "Clue Game",
            file: "games/clue.html",
            requiredPage: 13,
            autoAdvanceDelay: 2000
        },
        electric: {
            title: "Electric Game",
            file: "games/electric.html",
            requiredPage: 14,
            autoAdvanceDelay: 2000
        },
        maze: {
            title: "Maze Game",
            file: "games/maze.html",
            requiredPage: 5,
            autoAdvanceDelay: 2000
        }
    },

    // Navigation settings
    navigation: {
        enableKeyboard: true,
        enableAutoAdvance: true,
        pageTransitionDelay: 500
    },

    // UI settings
    ui: {
        buttonStyle: {
            fontSize: '18px',
            padding: '14px 28px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#000',
            borderRadius: '8px'
        },
        modalStyle: {
            backgroundColor: '#333',
            borderColor: '#fff',
            borderRadius: '10px'
        }
    }
};

// Function to apply button positions from config
function applyButtonPositions() {
    Object.keys(COMIC_CONFIG.buttonPositions).forEach(gameType => {
        const position = COMIC_CONFIG.buttonPositions[gameType];
        const button = document.querySelector(`.overlay-button[data-game="${gameType}"]`);
        if (button) {
            button.style.top = position.top + 'px';
            button.style.left = position.left + '%';
        }
    });
}

// Function to get game config
function getGameConfig(gameType) {
    return COMIC_CONFIG.games[gameType] || null;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = COMIC_CONFIG;
} else {
    window.COMIC_CONFIG = COMIC_CONFIG;
    window.applyButtonPositions = applyButtonPositions;
    window.getGameConfig = getGameConfig;
} 