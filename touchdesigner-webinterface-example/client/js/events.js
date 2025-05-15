// events.js
import { sendUpdate } from './websocket.js';
import { updateThemeColor } from './ui.js';

export function initializeEventListeners() {
  document.getElementById('furniture-category').addEventListener('change', (e) => {
    sendUpdate('update_category', e.target.value);
  });

  document.getElementById('color-scheme').addEventListener('change', (e) => {
    const selected = e.target;
    const hex = selected.options[selected.selectedIndex].dataset.hexcolor;
    sendUpdate('update_color', hex);
    updateThemeColor(hex);
  });

  const widthInput = document.getElementById('room-width-input');
  const lengthInput = document.getElementById('room-length-input');
  const areaValue = document.getElementById('room-area-value');

  const updateDimensions = () => {
    const width = parseInt(widthInput.value);
    const length = parseInt(lengthInput.value);
    const area = (width * length) / 10000;
    areaValue.textContent = `${area}`;
    sendUpdate('update_room_dimensions', { width, length });
  };

  widthInput.addEventListener('input', updateDimensions);
  lengthInput.addEventListener('input', updateDimensions);
}
