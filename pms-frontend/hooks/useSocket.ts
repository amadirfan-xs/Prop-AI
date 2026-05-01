import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_API_URL;

interface SocketOptions {
    namespace?: string;
    autoConnect?: boolean;
    auth?: any;
}

export const useSocket = (options: SocketOptions = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const url = options.namespace ? `${SOCKET_URL}/${options.namespace}` : SOCKET_URL;
    
    // Initialize socket connection
    const socket = io(url as string, {
      transports: ['websocket'],
      autoConnect: options.autoConnect ?? true,
      auth: options.auth || {},
    });

    socket.on('connect', () => {
      console.log(`Connected to socket gateway [${options.namespace || 'root'}]`);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log(`Disconnected from socket gateway [${options.namespace || 'root'}]`);
      setIsConnected(false);
    });

    socketRef.current = socket;

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [options.namespace, options.autoConnect, JSON.stringify(options.auth)]);

  const on = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: string) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    }
  };

  const emit = (event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return { isConnected, on, off, emit, socket: socketRef.current };
};
