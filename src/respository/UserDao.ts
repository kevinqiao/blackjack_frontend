import { UserModel } from "../model";

export const useUserDao = () => {

  const updateUser = (data: any) => {
    if (typeof window !== "undefined") {
      const userstr = window.localStorage.getItem("users");
      if (typeof userstr != "undefined" && userstr != null) {
        let users = JSON.parse(userstr);
        if (users?.length > 0) {
          const user = users.find((t: UserModel) => t.uid === data.uid);
          Object.assign(user, data);
          window.localStorage.setItem("users", JSON.stringify(users));
        }
      }
    }
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

  const findUser = (uid: string) => {
    if (typeof window !== "undefined") {
      const usersts = window.localStorage.getItem("users");
      if (typeof usersts != "undefined" && usersts != null) {
        const users = JSON.parse(usersts);
        if (users?.length > 0)
          return users.find((t: UserModel) => t.uid === uid);
      }
    }
    return null;
  }

  return { findUser, createUser, updateUser }
}

export default useUserDao
