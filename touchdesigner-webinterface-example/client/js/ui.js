// ui.js
import { sendUpdate } from './websocket.js';
import { getCorrespondingTheme } from './theme.js';

let currentState = {};

export function updateUIWithNewState(state) {
  currentState = state;

  const categorySelect = document.getElementById('furniture-category');
  if (categorySelect && categorySelect.value !== state.furnitureCategory) {
    categorySelect.value = state.furnitureCategory;
  }

  const colorSchemeSelect = document.getElementById('color-scheme');
  if (colorSchemeSelect && colorSchemeSelect.value !== state.colorScheme) {
    colorSchemeSelect.value = getCorrespondingTheme(state.colorScheme);
    updateThemeColor(state.colorScheme);
  }

  const widthInput = document.getElementById('room-width-input');
  const lengthInput = document.getElementById('room-length-input');
  const areaValue = document.getElementById('room-area-value');

  widthInput.value = state.roomWidth;
  lengthInput.value = state.roomLength;

  const area = state.roomWidth * state.roomLength / 10000;
  areaValue.textContent = `${area}`;

  updatePopularItemsChart(state.popularItems);
}

export function updatePopularItemsChart(items) {
  const chartContainer = document.getElementById('popular-items-chart');
  chartContainer.innerHTML = '';

  const maxCount = Math.max(...items.map(item => item.units_sold || 0));
  const maxSustainability = Math.max(...items.map(i => i.sustainability_rating || 0));
  const minSustainability = Math.min(...items.map(i => i.sustainability_rating || 0));
  const range = maxSustainability - minSustainability;

  items.forEach(item => {
    const percentage = (item.units_sold / maxCount) * 100;

    const barContainer = document.createElement('div');
    barContainer.className = 'chart-bar-container';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'item-name';
    nameSpan.textContent = item.product_name;

    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.width = `${percentage}%`;

    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#7FFF00', '#00FF00'];
    const scaled = range > 0 ? (item.sustainability_rating - minSustainability) / range : 0;
    bar.style.backgroundColor = colors[Math.floor(scaled * (colors.length - 1))];

    const countSpan = document.createElement('span');
    countSpan.className = 'item-count';
    countSpan.textContent = item.count;

    barContainer.append(nameSpan, bar, countSpan);
    chartContainer.appendChild(barContainer);
  });
}

export function updateThemeColor(color) {
  document.documentElement.className = '';
  const themeColor = getCorrespondingTheme(color);
  if (themeColor) {
    document.documentElement.classList.add(`theme-${themeColor}`);
  }
}
