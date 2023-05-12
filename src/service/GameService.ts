
import useGameAPI from "../api/GameAPI";



const useGameService = () => {
    const gameAPI = useGameAPI();
   

    const deal = (gameId: number, chips: number) => {
       
        gameAPI.deal(gameId,chips).then(()=>console.log("deal chips:"+chips))
    }

    const hit = (gameId: number) => {
       
        gameAPI.hit(gameId).then(()=>console.log("hit cards"))
    }
    const split = (gameId: number) => {
        gameAPI.split(gameId).then(()=>console.log("split cards"))
    }

    const double = () => {
      

    }
    const insure = () => {

       

    }

    const stand = (gameId: number) => {
        gameAPI.stand(gameId).then(()=>console.log("stand on seat"))
    }

   

  
    return {  deal, hit, split, double, insure, stand }

}
export default useGameService
