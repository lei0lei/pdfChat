import React, { useState } from 'react';
import SocketContext from './SocketContext';

const SocketContextComponent = ({ children }) => {
  const [socket, setSocket] = useState(null);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      { children }
    </SocketContext.Provider>
  );
}

export default SocketContextComponent;
