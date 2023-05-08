
import { useEffect } from "react";
import { UserModel } from "../model/types/User";
import useUserDao from "../respository/UserDao";
import { useUserManager } from "./UserManager";

const useUserService = () => {

    const { findUser,  createUser ,updateUser} = useUserDao();
    const signin = (): UserModel | null => {
        if (typeof window !== "undefined") {
            const userstr = window.localStorage.getItem("user");
            if (userstr) {
                let user = JSON.parse(userstr);
                console.log(user)
                // user =findUser(user.uid)
                return user;
            }
        }
        return null;
    }
    const login = (userId: string, password: string): UserModel | null => {
        const user = findUser(userId);
        if (user)
            window.localStorage.setItem("user", JSON.stringify(user))
        return user;
    }
    const logout = () => {
        window.localStorage.removeItem("user")
    }
    useEffect(() => {
        // window.localStorage.removeItem("users")
        const userstr = window.localStorage.getItem("users");
        if (!userstr) {
            for (let i = 0; i < 5; i++) {
                const user: UserModel = { uid: (i + 1) + "", token: Date.now() + "", name: "user" + (i + 1), chips: 0, tableId: 0,ver:0 }
                createUser(user);
            }
        } 
    }, [])
    return { signin, login, logout }

}
export default useUserService
