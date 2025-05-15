    const img = document.getElementById('frame');
    const socket = new WebSocket('ws://localhost:5002');

    socket.binaryType = 'arraybuffer';

    socket.onopen = () => {
      console.log('WebSocket connected.');
    };

    socket.onmessage = (event) => {
      const buffer = event.data;
      const text = new TextDecoder().decode(buffer);

      try {
        const json = JSON.parse(text);
        if (json.type === 'frame' && json.data) {
          img.src = 'data:image/jpeg;base64,' + json.data;
        } else {
          console.warn('Unexpected message:', json);
        }
      } catch (e) {
        console.error('Error parsing frame:', e);
      }
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    socket.onclose = () => {
      console.warn('WebSocket connection closed');
    };