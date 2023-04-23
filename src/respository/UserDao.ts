import { UserModel } from "../model";

export const useUserDao = () => {

  const updateUserWithLock = (data: any,ver:number) => {
    let user = null;
    if (typeof window !== "undefined") {
      const userstr = window.localStorage.getItem("users");
      if (typeof userstr != "undefined" && userstr != null) {
        const users = JSON.parse(userstr);
        if (users?.length > 0) {
          user = users.find((t: UserModel) => t.uid == data.uid);
          if (user.ver === ver) {
            Object.assign(user, data, { ver: 0 });
            window.localStorage.setItem("users", JSON.stringify(users));
          }
        }
      }
    }
    return user;
  }
  const createUser = (data: any) => {
    if (typeof window !== "undefined") {
      const userstr = window.localStorage.getItem("users");
      if (typeof userstr != "undefined" && userstr != null) {
        let users = JSON.parse(userstr);
        if (!users)
          users = [];
        users.push(data);
        window.localStorage.setItem("users", JSON.stringify(users));
      } else {
        window.localStorage.setItem("users", JSON.stringify([data]));
      }
    }
  }

  const findUserWithLock = (uid: string) => {
    let user = null;
    if (typeof window !== "undefined") {
      const userstr = window.localStorage.getItem("users");

      if (typeof userstr != "undefined" && userstr != null) {
        const users = JSON.parse(userstr);
        user = users.find((t: UserModel) => t.uid === uid);
    
        if (user != null && (!user.ver||user.ver === 0 || Date.now() - user.ver > 400)) {
          user.ver = Date.now();
          window.localStorage.setItem("users", JSON.stringify(users));
          return user
        }
      }
    }
    return null;
  }
  const findUser = (uid:string): UserModel | null => {

    if (typeof window !== "undefined") {
      const userstr = window.localStorage.getItem("users");
      if (typeof userstr != "undefined" && userstr != null) {
        const users = JSON.parse(userstr);
        if (users?.length > 0)
          return users.find((t: UserModel) => t.uid === uid);
      }
    }
    return null;
  }
  return { findUser,findUserWithLock, createUser, updateUserWithLock }
}

export default useUserDao
