import React, { createContext, useContext, useEffect } from "react";
import { TableModel } from "../model";

import useEventSubscriber from "./EventManager";
import useUserService from "./UserService";
interface IUserContext {
  uid: string | null;
  token: string | null;
  tableId: number;
  chips: number;
  login: (userId: string, password: string) => void;
  logout: () => void;
  joinTable:(table:TableModel)=>void;
}

const initialState = {
  uid: null,
  token: null,
  chips: 0,
  gameId: 0,
};

const actions = {
  SIGNIN_SUCCESS: "SIGNIN_SUCCESS",
  LOGOUT_COMPLETE: "LOGOUT_COMPLETE",
  UPDATE_USER: "UPDATE_USER",
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actions.SIGNIN_SUCCESS:
      return action.data;
    case actions.LOGOUT_COMPLETE:
      return initialState;
    case actions.UPDATE_USER:
      const u = Object.assign({}, state, action.data);

      return u;
    default:
      return state;
  }
};

const UserContext = createContext<IUserContext>({
  uid: null,
  token: null,
  tableId: 0,
  chips: 0,
  login: (userId: string, password: string) => null,
  logout: () => null,
  joinTable:()=>null
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { event } = useEventSubscriber(["updateUser"], ["model"]);
  const userService = useUserService();
  useEffect(() => {
     window.localStorage.removeItem("users")
     window.localStorage.removeItem("user")
    const user = userService.signin();
    console.log(user)
    // console.log(user)
    if (user) dispatch({ type: actions.SIGNIN_SUCCESS, data: user });
  }, []);

  useEffect(() => {
    if (event?.name === "updateUser") {
     
      const u = Object.assign({}, state, event.data);
      
      window.localStorage.setItem("user", JSON.stringify(u));
      dispatch({ type: actions.UPDATE_USER, data: u });
    }
  }, [event]);

  const value = {
    uid: state.uid,
    token: state.token,
    tableId: state.tableId,
    chips: state.chips,
    login: (userId: string, token: string) => {
      const user = userService.login(userId, token);
      console.log(user);
      if (user) dispatch({ type: actions.SIGNIN_SUCCESS, data: user });
    },
    logout: () => {
      console.log("logging out");
      dispatch({ type: actions.LOGOUT_COMPLETE, data: null });
      userService.logout();
    },
    joinTable:(table:TableModel)=>{
      dispatch({type:actions.UPDATE_USER,data:{tableId:table.id}})
    }
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserManager = () => {
  return useContext(UserContext);
};