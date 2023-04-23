import { useEffect } from "react";
import { GameModel } from "../model/types/Game";
import useUserDao from "../respository/UserDao";
import useEventSubscriber, { EventModel } from "../service/EventManager";
import useGameEngine from "../service/GameEngine";


const useInitGameProcessor = () => {
    const { createEvent } = useEventSubscriber([], []);
    const userDao = useUserDao();
    const gameEngine = useGameEngine();
    const process = (game: GameModel) => {
        game.cards=gameEngine.shuffle();
        // for(let seat of game.seats){
        //     if(seat.no<3&&seat.uid){
        //         const user = userDao.findUserWithLock(seat.uid);
        //         if(user){
        //             // console.log("update user gameId:"+game.gameId+" ver:"+user.ver)
        //             userDao.updateUserWithLock({uid:seat.uid,gameId:game.gameId},user.ver)
        //         }
        //     }
        // }

        const event: EventModel = { name: "initGame", topic: "model", data: JSON.parse(JSON.stringify(game)), delay: 0 }
        createEvent(event);
    }


    useEffect(() => {

    }, [])
    return { process }

}
export default useInitGameProcessor
