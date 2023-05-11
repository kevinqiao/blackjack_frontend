import axios, { AxiosRequestConfig } from 'axios';
import { useUserManager } from '../service/UserManager';
const useTournamentAPI=()=>{
     const {uid,token} =useUserManager();

     const join = async (tournamentId:number,uid:string):Promise<any> => {
    
      const url = "http://localhost:8080/tournament/join/"+tournamentId+"?uid="+uid;
      const headers: AxiosRequestConfig['headers'] = {
        'Authorization': `Bearer ${token}`,
      };
  
      const res = await  axios.get(url, { headers })
      return res.data
     
    };
    const findOne = async (tournamentId:number) => {
      const url = "http://localhost:8080/tournament/"+tournamentId;
      const res = await  axios.get(url)
      return res.data
    };
    const findAll = async () => {
      const url = "http://localhost:8080/tournament/list";
      const res = await  axios.get(url)
      return res.data
    };
    return {join,findOne,findAll}
}
export default useTournamentAPI
