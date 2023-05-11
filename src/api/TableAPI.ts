import { TableModel } from "../model";
import { useUserManager } from "../service/UserManager";
import axios, { AxiosRequestConfig } from 'axios';
const useTableAPI=()=>{
  const {uid,token} =useUserManager();
  const leave = async (tableId:number) => {
 
    
  const url = "http://localhost:8080/table/leave/"+tableId;
  const headers: AxiosRequestConfig['headers'] = {
    'Authorization': `Bearer ${token}`,
  };

 const res =  await axios.get(url, { headers })
  
 };
 const standup = async (tableId:number):Promise<any> => {
 
  const url = "http://localhost:8080/table/standup/"+tableId;
  const headers: AxiosRequestConfig['headers'] = {
    'Authorization': `Bearer ${token}`,
  };

 const res =  await axios.get(url, { headers })

};
  const sitDown = async (tableId:number,uid:string,seatNo:number):Promise<void> => {
 
    const url = "http://localhost:8080/table/sitdown/"+tableId+"?seatNo="+seatNo;
    // const res = await fetch(url);

    const headers: AxiosRequestConfig['headers'] = {
      'Authorization': `Bearer ${token}`,
    };

   const res =  await axios.get(url, { headers })

 };
 const findOne = async (tableId:number):Promise<TableModel|null>=> {
   console.log("tableId:"+tableId)
   const url = "http://localhost:8080/table/"+tableId;
   console.log(url)
   const res = await fetch(url);
   const json = await res.json();
   if(json.ok)
     return json.message;
   else
     return null
 };
 const findAll = async () => {
   const url = "http://localhost:8080/table/list";
   const res = await fetch(url);
   const json = await res.json();
   return json;
 };
 return {leave,standup,sitDown,findOne,findAll}
}
export default useTableAPI
