const { REACT_APP_DEPLOY} = process.env;
const dev = {
  BACKBONE: 0,
  USER_URL: "http://localhost:8000/user",
  TOURNAMENT_URL: "http://localhost:8000/tournament",
  GAME_URL: "http://localhost:8000/game",
};
const local = {
  BACKBONE: 1,
};
const prod = {
    BACKBONE: 0,
    USER_URL: "http://localhost:8000/user",
    TOURNAMENT_URL: "http://localhost:8000/tournament",
    GAME_URL: "http://localhost:8000/game",
};

const config = (function () {
    console.log(process.env)
    console.log(process.env.REACT_APP_DEPLOY_ENV)
  switch (process.env.REACT_APP_DEPLOY_ENV) {
    case "dev":
      return dev;
    case "local":
      return local;
    case "prod":
      return prod;
    default:
      return local;
  }
})();

export default {
  ...config,
};