import React, { createContext, useContext} from "react";

interface INavContext {
  preMenu:number;
  menu: number;
  lastUpdate: number;
  change:(m:number)=>void;
}

const initialState = {
  preMenu:4,
  menu: 4,
  time:Date.now()
};

const actions = {
  MENU_CHANGE: "MENU_CHANGE",
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actions.MENU_CHANGE:
      return Object.assign({},state,action.data,{preMenu:state.menu});
    default:
      return state;
  }
};

const NavContext = createContext<INavContext>({
  preMenu:4,
  menu:4,
  lastUpdate:Date.now(),
  change:(m)=>null
});

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const value = {
    preMenu:state.preMenu,
    menu: state.menu,
    lastUpdate: state.time,
    change:(m:number)=>{
      if((Date.now()-state.time)>600)
        dispatch({type:actions.MENU_CHANGE,data:{menu:m,time:Date.now()}})
    }
  };

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
};

export const useNavManager = () => {
  return useContext(NavContext);
};
