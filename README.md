# Interactive Comic System

A modular interactive comic system with embedded games and progress tracking.

## Features

- **7 Comic Pages**: Navigate through the story with next/previous buttons
- **2 Embedded Games**: Hacking challenge and Maze challenge
- **Progress Tracking**: Must complete games to advance through the story
- **Easy Customization**: Simple configuration file for adjustments
- **Responsive Design**: Works on desktop and mobile devices

## File Structure

```
comic/
├── index.html          # Main comic interface
├── style.css           # Styling for comic pages and games
├── comic.js            # Main comic logic and navigation
├── config.js           # Configuration file for easy adjustments
├── games/
│   ├── hacking.html    # Hacking challenge game
│   └── maze.html       # Maze challenge game
└── images/
    └── pages/          # Comic page images (page-1.png to page-7.png)
```

## How to Use

### Basic Navigation
- **Next Page**: Click "Next Page" button or press Right Arrow / Spacebar
- **Previous Page**: Click "Previous Page" button or press Left Arrow
- **Close Game**: Press Escape key or click the × button

### Game Flow
1. **Page 1**: View comic and click "Start Hacking Game" button
2. **Complete Hacking Game**: Must finish to proceed to Page 2
3. **Page 2**: View comic (no game required)
4. **Page 3**: View comic and click "Start Maze Game" button
5. **Complete Maze Game**: Must finish to proceed to Page 4
6. **Pages 4-7**: Continue reading the story

## Easy Customization

### Adjusting Button Positions

Edit `config.js` to easily adjust button positions:

```javascript
const COMIC_CONFIG = {
    buttonPositions: {
        hacking: {
            top: 200,    // pixels from top
            left: 60     // percentage from left
        },
        maze: {
            top: 300,    // pixels from top
            left: 40     // percentage from left
        }
    }
    // ... other settings
};
```

### Adding New Games

1. Create your game HTML file in the `games/` folder
2. Add game configuration to `config.js`:
   ```javascript
   games: {
       yourNewGame: {
           title: "Your Game Title",
           file: "games/your-game.html",
           requiredPage: 5,  // Which page requires this game
           autoAdvanceDelay: 2000
       }
   }
   ```
3. Add button position to `buttonPositions`
4. Add the game button to the appropriate comic page in `index.html`
5. Ensure your game sends completion message:
   ```javascript
   // In your game when completed
   if (window.parent && window.parent !== window) {
       window.parent.postMessage({
           type: 'gameComplete',
           game: 'yourNewGame'
       }, '*');
   }
   ```

### Game Communication

Games communicate with the comic system using `postMessage`:

**From Game to Comic:**
```javascript
window.parent.postMessage({
    type: 'gameComplete',
    game: 'gameName'
}, '*');
```

**From Comic to Game:**
```javascript
// Send message to game iframe
sendMessageToGame('gameName', {
    action: 'reset',
    data: { /* your data */ }
});
```

## Configuration Options

### Button Styling
```javascript
ui: {
    buttonStyle: {
        fontSize: '18px',
        padding: '14px 28px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#000',
        borderRadius: '8px'
    }
}
```

### Navigation Settings
```javascript
navigation: {
    enableKeyboard: true,      // Enable arrow key navigation
    enableAutoAdvance: true,   // Auto-advance after game completion
    pageTransitionDelay: 500   // Transition animation duration
}
```

## Browser Compatibility

- Modern browsers with ES6 support
- Mobile browsers (responsive design)
- Requires JavaScript enabled

## Troubleshooting

### Button Not Visible
- Check button positions in `config.js`
- Ensure comic image is loaded
- Check browser console for errors

### Game Not Loading
- Verify game file path in `config.js`
- Check iframe security settings
- Ensure game sends completion message

### Navigation Issues
- Check if games are completed before advancing
- Verify keyboard event listeners
- Check browser console for JavaScript errors

## Development

To modify the system:

1. **Add new pages**: Add sections to `index.html` and update `totalPages` in `comic.js`
2. **Change styling**: Modify `style.css` for visual changes
3. **Add features**: Extend `comic.js` with new functionality
4. **Configure**: Use `config.js` for easy adjustments

## License

This project is open source and available under the MIT License. 