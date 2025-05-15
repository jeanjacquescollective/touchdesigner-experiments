// theme.js
export function getCorrespondingTheme(color) {
    const themeColors = {
      '#0058A3': 'blue',
      '#FFCC00': 'yellow',
      '#4CAF50': 'green',
      '#A9A9A9': 'gray',
    };
    return themeColors[color] || 'default';
  }
  