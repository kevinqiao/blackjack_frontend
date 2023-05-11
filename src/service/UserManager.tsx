import React, { createContext, useContext, useEffect } from "react";
import { TableModel, UserModel } from "../model";
import useUserDao from "../respository/UserDao";

import useEventSubscriber from "./EventManager";
import useUserService from "./UserService";
interface IUserContext {
  uid: string | null;
  token: string | null;
  tableId: number;
  chips: number;
  // login: (userId: string, password: string) => void;
  // logout: () => void;
  // joinTable: (table: TableModel) => void;
  updateUser:(data:any)=>void;
  signout:()=>void
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
      console.log(u)
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
  updateUser:()=>null,
  signout:()=>null
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { event } = useEventSubscriber(["leaveTable"], ["model"]);
  const userService = useUserService();

  useEffect(() => {
    userService.signin().then((user)=>{
      window.localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: actions.UPDATE_USER, data: user });
    })
  }, []);

  useEffect(() => {
    if (event?.name === "leaveTable") {
      const uid = event.data.uid;
      if(uid===state.uid){
        console.log("handle leave table")
        dispatch({ type: actions.UPDATE_USER, data: {tableId:0} });
      }
    }
  }, [event]);

  const value = {
    uid: state.uid,
    token: state.token,
    tableId: state.tableId,
    chips: state.chips,
    updateUser:(data:any)=>{
      const u = Object.assign({}, state, data);
      window.localStorage.setItem("user", JSON.stringify(u));
      dispatch({ type: actions.UPDATE_USER, data: data });
    },
    signout:()=>{
      window.localStorage.removeItem("user")
      dispatch({type:actions.UPDATE_USER,data:initialState})
    }
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserManager = () => {
  return useContext(UserContext);
};
