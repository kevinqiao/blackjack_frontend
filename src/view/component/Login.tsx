import useCoordManager from "../../service/CoordManager";
import { useTournamentManager } from "../../service/TournamentManager";
import { useUserManager } from "../../service/UserManager";

const Login = () => {
  const { viewport } = useCoordManager();
  const { uid, token, login, logout } = useUserManager();
  const { leave, standup } = useTournamentManager();
  const signout = () => {
    logout();
    // leave();
  };
  const reset = () => {
    window.localStorage.removeItem("users");
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("tables");
    window.localStorage.removeItem("games");
  };

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
              onClick={() => login("1", "test")}
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
              onClick={() => login("2", "test")}
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
              onClick={() => login("3", "test")}
            >
              User 3
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
