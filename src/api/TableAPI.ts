
const useTableAPI=()=>{
  const leave = async (tableId:number,uid:string):Promise<any> => {
 
    const url = "http://localhost:8080/table/leave/"+tableId+"?uid="+uid;
    const res = await fetch(url);
    const json = await res.json();
    console.log(json)
    return json;
  
 };
 const standup = async (tableId:number,uid:string):Promise<any> => {
 
  const url = "http://localhost:8080/table/standup/"+tableId+"?uid="+uid;
  const res = await fetch(url);
  const json = await res.json();
  console.log(json)
  return json;

};
  const sitDown = async (tableId:number,uid:string,seatNo:number):Promise<any> => {
 
    const url = "http://localhost:8080/table/sitdown/"+tableId+"?uid="+uid+"&seatNo="+seatNo;
    const res = await fetch(url);
    const json = await res.json();
    console.log(json)
    return json;
  
 };
 const findOne = async (tableId:number) => {
   console.log("tableId:"+tableId)
   const url = "http://localhost:8080/table/"+tableId;
   console.log(url)
   const res = await fetch(url);
   const json = await res.json();
   return json;
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
