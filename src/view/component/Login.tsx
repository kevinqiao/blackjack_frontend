import useCoordManager from "../../service/CoordManager";
import { useTournamentManager } from "../../service/TournamentManager";
import { useUserManager } from "../../service/UserManager";

const Login = () => {
  const { viewport } = useCoordManager();
  const { uid, token, login, logout } = useUserManager();
  const { leave } = useTournamentManager();
  const signout = () => {
    logout();
    // leave();
  };
  console.log(uid);
  return (
    <>
      {!uid ? (
        <div
          style={{
            position: "absolute",
            zIndex: 1000,
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
            zIndex: 1000,
            top: 0,
            left: 100,
            width: 250,
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
        </div>
      )}
    </>
  );
};
export default Login;
