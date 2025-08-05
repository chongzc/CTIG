// Comic Configuration File
// Easy to adjust settings without modifying main code

const COMIC_CONFIG = {
    // Button positions for easy adjustment
    buttonPositions: {
        hacking: {
            top: 200,    // pixels from top
            left: 60     // percentage from left
        },
        maze: {
            top: 300,    // pixels from top
            left: 40     // percentage from left
        }
    },
    
    // Game settings
    games: {
        hacking: {
            title: "Hacking Challenge",
            file: "games/hacking.html",
            requiredPage: 1,
            autoAdvanceDelay: 2000
        },
        maze: {
            title: "Maze Challenge", 
            file: "games/maze.html",
            requiredPage: 3,
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