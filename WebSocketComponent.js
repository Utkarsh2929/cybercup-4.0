import React, { useEffect, useState } from 'react';

const WebSocketComponent = () => {
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Create a WebSocket connection
    const ws = new WebSocket('ws://localhost:5000'); // Ensure this points to the correct server

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      setMessage(event.data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };

    setSocket(ws);

    // Cleanup function to close the WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []); // Empty dependency array to run only once

  const sendMessage = () => {
    if (socket && isConnected) {
      socket.send('Hello Server!');
    } else {
      console.error('WebSocket is not connected. Unable to send message.');
    }
  };

  return (
    <div>
      <h1>WebSocket Connection</h1>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <p>Message: {message}</p>
      <button onClick={sendMessage} disabled={!isConnected}>Send Message</button>
    </div>
  );
};

export default WebSocketComponent;
