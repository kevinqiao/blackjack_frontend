import { TableModel } from "../model";
import { useUserManager } from "../service/UserManager";
import axios, { AxiosRequestConfig } from 'axios';
const useGameAPI=()=>{
  const {uid,token} =useUserManager();
  const findGame = async (gameId:number) => {
      const url = "http://localhost:8080/game/find/"+gameId;
      const headers: AxiosRequestConfig['headers'] = {
        'Authorization': `Bearer ${token}`,
      };

     const res =  await axios.get(url, { headers })
     console.log(res.data)
     return res.data;
  }
  const findGameByTable = async (tableId:number) => {
    const url = "http://localhost:8080/game/table/"+tableId;
    const headers: AxiosRequestConfig['headers'] = {
      'Authorization': `Bearer ${token}`,
    };
   const res =  await axios.get(url, { headers })
   console.log(res)
   if(res.data.ok)
      return res.data.message
   else
      return null
}
  const deal = async (gameId:number,chips:number) => {
  
      const url = "http://localhost:8080/game/deal/"+gameId+"?chips="+chips;
      const headers: AxiosRequestConfig['headers'] = {
        'Authorization': `Bearer ${token}`,
      };

    const res =  await axios.get(url, { headers })
  
  };
  const hit = async (gameId:number) => {
 
    
    const url = "http://localhost:8080/game/hit/"+gameId;
    const headers: AxiosRequestConfig['headers'] = {
      'Authorization': `Bearer ${token}`,
    };

  const res =  await axios.get(url, { headers })

};
const split = async (gameId:number) => {
 
  const url = "http://localhost:8080/game/split/"+gameId;
  const headers: AxiosRequestConfig['headers'] = {
    'Authorization': `Bearer ${token}`,
  };
  const res =  await axios.get(url, { headers })

};
const stand = async (gameId:number) => {
 
    const url = "http://localhost:8080/game/stand/"+gameId;
    const headers: AxiosRequestConfig['headers'] = {
      'Authorization': `Bearer ${token}`,
    };
    const res =  await axios.get(url, { headers })

};
return {deal,hit,stand,split,findGame,findGameByTable}
 
}
export default useGameAPI
