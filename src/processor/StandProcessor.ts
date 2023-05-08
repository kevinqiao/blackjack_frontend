import { useEffect } from "react";
import { SeatModel } from "../model";
import { GameModel } from "../model/types/Game";
import useGameEngine from "../service/GameEngine";


const useStandProcessor = () => {
    const gameEngine = useGameEngine();
    const process = (gameObj: GameModel) => {

        const seat = gameObj.seats.find((s: SeatModel) => s.no === gameObj.currentTurn.seat);
       
        if (seat) {
            const currentSlot = seat.slots.find((s) => s.id === seat.currentSlot);

            if (currentSlot) {
                currentSlot.status = 1;
                if (gameEngine.turnSlot(gameObj, seat)) {
                    return;
                }

                seat.status = 1;
                if (gameEngine.turnSeat(gameObj, seat)) {
                    return;
                }
                gameEngine.turnDealer(gameObj);
                gameObj.status = 1;
            }
        }
    }

    useEffect(() => {

    }, [])
    return { process }

}
export default useStandProcessor
