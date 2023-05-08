
const useTournamentAPI=()=>{
     const join = async (tournamentId:number,uid:string):Promise<any> => {
    
      const url = "http://localhost:8080/tournament/join/"+tournamentId+"?uid="+uid;
      const res = await fetch(url);
      const json = await res.json();
      console.log(json)
      return json;
     
    };
    const findOne = async (tournamentId:number) => {
      const url = "http://localhost:8080/tournament/"+tournamentId;
      const res = await fetch(url);
      const json = await res.json();
      return json;
    };
    const findAll = async () => {
      const url = "http://localhost:8080/tournament/list";
      const res = await fetch(url);
      const json = await res.json();
      return json;
    };
    return {join,findOne,findAll}
}
export default useTournamentAPI
