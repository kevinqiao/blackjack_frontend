import React, { useEffect, useState, useContext, createContext, useRef } from "react";
import io, { Socket } from 'socket.io-client';
const url = "ws://127.0.0.1:8080/?uid=1";
interface ISocketContext {
  sendEvent:(uid:string,event:any)=>void
}
export const SocketContext = createContext<ISocketContext>({
  sendEvent:()=>null
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    console.log("tryinig connect to websocket")
    // Connect to the Socket.IO server
    socketRef.current = io(url);
    if(socketRef.current!=null)
  
      socketRef.current.on("connect", () => {
        console.log("socket connected"); // true
    });
    // Listen for new messages
    if(socketRef.current)
    socketRef.current.on('events', (message:any) => {
      console.log(message)
    });

    // Clean up when the component is unmounted
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);
  const value = {
    sendEvent: (uid:string,event:any) => {
      // console.log("send events");
      // if (ws) {
      //   console.log("socket is ready:");
      //   ws.emit("events", event);
      // }
      // ws.send(JSON.stringify(event));
    },
  };
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

const useSocket = () => {
  return useContext(SocketContext);
};
export default useSocket;
