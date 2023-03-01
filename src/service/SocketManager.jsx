import React, { useEffect, useState, useContext, createContext } from "react";
import socketIOClient from "socket.io-client";
import { useGameManager } from "./GameManager";
const url = "ws://127.0.0.1:8080/?a=b";
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const { tasks, addTask, updateTask, removeTask, removeAll } = useGameManager();

  useEffect(() => {
    if (!ws) {
      const socket = socketIOClient(url);
      socket.emit("events", { name: "Nest" });
      // const socket = new WebSocket(url);
      setWs(socket);
      socket.on("connect", () => {
        console.log("socket connected:" + socket.connected); // true
      });

      socket.on("disconnect", () => {
        setWs(null);
        console.log("socket disconnected:" + !socket.connected); // false
      });
      socket.on("events", (event) => {
        console.log(event);

        try {
          // const json = JSON.parse(event.data);
          const eventName = event.name;
          console.log(eventName);
          switch (eventName) {
            case "taskCreated":
  
              break;
            case "taskUpdated":
              updateTask(event.task);
              break;
            case "taskRemoved":
              removeTask(event.taskId);
              break;
            case "allRemoved":
              removeAll();
              break;
            default:
              break;
          }
        } catch (e) {
          console.log(e);
        }
      });
    }
  }, [ws, addTask, removeAll, removeTask, updateTask, tasks]);
  const value = {
    sendEvent: (event) => {
      console.log("send events");
      if (ws) {
        console.log("socket is ready:");
        ws.emit("events", event);
      }
      // ws.send(JSON.stringify(event));
    },
  };
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

const useSocket = () => {
  return useContext(SocketContext);
};
export default useSocket;
