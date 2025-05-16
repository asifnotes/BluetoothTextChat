// UUIDs for the custom BLE service & characteristics
const SERVICE_UUID   = '00001234-0000-1000-8000-00805f9b34fb';
const CHAR_TX_UUID   = '00005678-0000-1000-8000-00805f9b34fb'; // Notifications → browser
const CHAR_RX_UUID   = '00008765-0000-1000-8000-00805f9b34fb'; // Write ← browser

let txChar = null;
let rxChar = null;

// UI Elements
const connectBtn = document.getElementById('connectBtn');
const chatDiv    = document.getElementById('chat');
const messagesEl = document.getElementById('messages');
const inputEl    = document.getElementById('inputMsg');
const sendBtn    = document.getElementById('sendBtn');

// 1. Discover & connect
connectBtn.addEventListener('click', async () => {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [SERVICE_UUID] }]
    });
    const server  = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);

    txChar = await service.getCharacteristic(CHAR_TX_UUID);
    rxChar = await service.getCharacteristic(CHAR_RX_UUID);

    await txChar.startNotifications();
    txChar.addEventListener('characteristicvaluechanged', handleIncoming);

    connectBtn.disabled = true;
    chatDiv.classList.remove('hidden');

    // Handle unexpected disconnects
    device.addEventListener('gattserverdisconnected', () => {
      alert('Bluetooth device disconnected');
      connectBtn.disabled = false;
      chatDiv.classList.add('hidden');
      messagesEl.innerHTML = '';
    });
  } catch (err) {
    console.error('Connection failed:', err);
    alert('Bluetooth connection failed: ' + err.message);
  }
});

// 2. Receive incoming text
function handleIncoming(event) {
  const value = event.target.value; // DataView
  const text  = new TextDecoder().decode(value);
  const msgEl = document.createElement('div');
  msgEl.className = 'msg';
  msgEl.textContent = `Device: ${text}`;
  messagesEl.appendChild(msgEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// 3. Send text to device
sendBtn.addEventListener('click', async () => {
  const text = inputEl.value.trim();
  if (!text || !rxChar) return;

  const data = new TextEncoder().encode(text);
  try {
    await rxChar.writeValue(data);
    const msgEl = document.createElement('div');
    msgEl.className = 'msg';
    msgEl.textContent = `You: ${text}`;
    messagesEl.appendChild(msgEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    inputEl.value = '';
  } catch (err) {
    console.error('Write failed:', err);
    alert('Send failed: ' + err.message);
  }
});
