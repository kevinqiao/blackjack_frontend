import axios, { AxiosRequestConfig } from 'axios';

const useUserAPI=()=>{
 
  const loginByToken = async(token:string):Promise<any> => {
 
    const url = "http://localhost:8080/auth/token"

    const headers: AxiosRequestConfig['headers'] = {
      'Authorization': `Bearer ${token}`,
    };

   const res =  await axios.get(url, { headers })
   return res.data

  }
  const loginByPassword = async (username:string,password:string):Promise<any> => {
    const data = {
      username: username,
      password: password,
    };
    const url = "http://localhost:8080/auth/password"
    const res =  await axios.post(url, data);
    return res.data
    
}
 return {loginByToken,loginByPassword}
}
export default useUserAPI
