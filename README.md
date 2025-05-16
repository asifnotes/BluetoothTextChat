# Bluetooth Text Chat

A minimal HTML/CSS/JavaScript demo that uses the Web Bluetooth API to exchange text messages
between your browser and a nearby Bluetooth Low-Energy peripheral.

## Files

- **index.html** — UI structure and script include  
- **styles.css** — Simple styling via CSS  
- **app.js** — Core logic: discover, connect, send & receive text  

## Setup & Run

1. Serve over HTTPS (Web Bluetooth requires a secure origin).  
   - You can use [http-server](https://www.npmjs.com/package/http-server) with a cert:  
     ```sh
     http-server -S -C cert.pem -K key.pem
     ```
   - Or deploy to GitHub Pages / Netlify / Vercel (all provide HTTPS by default).

2. Open the page in a supported browser:
   - Chrome/Edge desktop (stable channel, with **Experimental Web Platform features** enabled if needed).  
   - Chrome on Android.

3. Click **Connect Bluetooth**, choose your BLE device exposing the custom service UUID, then start chatting.

## Security & Notes

- Must be served via HTTPS.  
- `requestDevice()` needs a direct user action.  
- GATT Characteristic write size ≲512 bytes; chunk larger payloads.  
- Listen for `gattserverdisconnected` to handle drops.

Enjoy your browser-to-BLE text chat!
