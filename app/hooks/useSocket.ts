import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8000';

export const useSocket = (id: string): Socket | null => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!id) return;

    socketRef.current = io(SOCKET_URL, {
      path: '/chat/socket.io/',
      transports: ['websocket', 'polling'],
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [id]);

  return socketRef.current;
};
