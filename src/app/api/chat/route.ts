// Sending the /pdf/upload2backend request with fetch
const baseurl = 'https://pdf-chat-server.vercel.app/'

async function chatMessage() {
    const info_A = { /* Your data */ };
    const response = await fetch('/pdf/upload2backend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    // Do something with the response
  }
  
