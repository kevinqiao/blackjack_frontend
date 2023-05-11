
import useUserAPI from "../api/UserAPI";
import { UserModel } from "../model/types/User";

const useUserService = () => {
    const userAPI = useUserAPI();
    const signin =async  (): Promise<UserModel | null> => {
        if (typeof window !== "undefined") {
            const userstr = window.localStorage.getItem("user");
            console.log(userstr)
            if (userstr) {
                let user = JSON.parse(userstr);
                if(user?.token){
                    const u = await userAPI.loginByToken(user.token);
                    return u;
                }
            }
        }
        return null;
    }
    const login = async (username: string, password: string): Promise<UserModel | null> => {
        const user = await userAPI.loginByPassword(username,password);
        if(user){
        //    updateUser(user)
           return user;
        }else
           return null;
    }
    const logout = () => {
        window.localStorage.removeItem("user")
    }
   
    return { signin, login, logout }

}
export default useUserService
