import { useEffect } from "react";
import { GameModel } from "../model/types/Game";
import useEventSubscriber, { EventModel } from "../service/EventManager";
import useGameEngine from "../service/GameEngine";


const useShuffleProcessor = () => {
    const { createEvent } = useEventSubscriber([], []);
    const gameEngine = useGameEngine();

    const process = (game: GameModel) => {
        game['cards'] = gameEngine.shuffle();
        const event: EventModel = { name: "initGame", topic: "model", data: JSON.parse(JSON.stringify(game)), delay: 0 }
        createEvent(event);
        // const event: EventModel = { name: "shuffleCards", topic: "model", data: JSON.parse(JSON.stringify(game)), delay: 0 }
        // createEvent(event);

    }


    useEffect(() => {

    }, [])
    return { process }

}
export default useShuffleProcessor
