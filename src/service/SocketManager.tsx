import React, { useEffect, useState, useContext, createContext, useRef } from "react";
import io, { Socket } from 'socket.io-client';
import useEventSubscriber from "./EventManager";
import { useUserManager } from "./UserManager";
const url = "ws://127.0.0.1:8080";
interface ISocketContext {
  sendEvent:(uid:string,event:any)=>void
}
export const SocketContext = createContext<ISocketContext>({
  sendEvent:()=>null
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {

  const socketRef = useRef<Socket | null>(null);
  const {uid,token}=useUserManager();
  const {createEvent} = useEventSubscriber([],[]);
  console.log(uid+":"+token)
  useEffect(() => {
    console.log("tryinig connect to websocket,"+uid+":"+token)
    // Connect to the Socket.IO server
    if(uid&&token){
          const uri=url+"/?uid="+uid+"&token="+token;
          socketRef.current = io(uri);
          if(socketRef.current!=null){        
              socketRef.current.on("connect", () => {
                  console.log("socket connected"); // true
              });
              socketRef.current.on('events', (events:any) => {
                console.log(events)
                 if(Array.isArray(events)){
                    let count=0;
                    for(const event of events){
                       setTimeout(()=>createEvent(event),count*10);
                       count++;
                    }
                 }else
                    createEvent(events)
              });
          }
    }
    // Clean up when the component is unmounted
    return () => {
      socketRef.current?.disconnect();
    };
  }, [uid,token]);
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
