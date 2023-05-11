import { useEffect } from "react";
import useUserAPI from "../../api/UserAPI";
import useCoordManager from "../../service/CoordManager";
import { useTournamentManager } from "../../service/TournamentManager";
import useTournamentService from "../../service/TournamentService";
import { useUserManager } from "../../service/UserManager";
import useUserService from "../../service/UserService";

const Login = () => {
  const { viewport } = useCoordManager();
  const { uid,token,updateUser,signout} = useUserManager();
  const  userService = useUserService();
  const { table} = useTournamentManager();
  const tournamentService = useTournamentService();

  const login=async (name:string,password:string)=>{
    const user = await userService.login(name,password)
    if(user)
       updateUser(user)

  }
  const reset = () => {
    window.localStorage.removeItem("users");
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("tables");
    window.localStorage.removeItem("games");
    window.localStorage.removeItem("turns");
  };
  const leave=()=>{
    if(uid&&table)
      tournamentService.leave(table.id);
  }
  const standup=()=>{
    if(uid&&table)
      tournamentService.standup(table.id);
  }
 
  return (
    <>
      {!uid ? (
        <div
          style={{
            position: "absolute",
            zIndex: 8000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: viewport ? viewport["height"] : 0,
            backgroundColor: "white",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-around", width: 400 }}>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 80,
                height: 40,
                borderRadius: 5,
                backgroundColor: "red",
                color: "white",
              }}
              onClick={() => login("kevin1", "12345")}
            >
              User 1
            </div>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 80,
                height: 40,
                borderRadius: 5,
                backgroundColor: "red",
                color: "white",
              }}
              onClick={() => login("kevin2", "12345")}
            >
              User 2
            </div>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 80,
                height: 40,
                borderRadius: 5,
                backgroundColor: "red",
                color: "white",
              }}
              onClick={() => login("kevin3", "12345")}
            >
              User 3
            </div>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 80,
                height: 40,
                borderRadius: 5,
                backgroundColor: "red",
                color: "white",
              }}
              onClick={() => login("kevin1","54321")}
            >
              Login
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            zIndex: 8000,
            top: 0,
            left: 100,
            width: 350,
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{
              cursor: "pointer",
              width: 80,
              height: 40,
              borderRadius: 5,
              backgroundColor: "red",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => signout()}
          >
            Logout
          </div>
          <div
            style={{
              cursor: "pointer",
              width: 80,
              height: 40,
              borderRadius: 5,
              backgroundColor: "red",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={leave}
          >
            Leave
          </div>
          <div
            style={{
              cursor: "pointer",
              width: 80,
              height: 40,
              borderRadius: 5,
              backgroundColor: "red",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={standup}
          >
            standup
          </div>
          <div
            style={{
              cursor: "pointer",
              width: 80,
              height: 40,
              borderRadius: 5,
              backgroundColor: "red",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={reset}
          >
            reset
          </div>
        </div>
      )}
    </>
  );
};
export default Login;
