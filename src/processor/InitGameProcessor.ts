import { useEffect } from "react";
import { GameModel } from "../model/types/Game";
import useEventSubscriber, { EventModel } from "../service/EventManager";


const useInitGameProcessor = () => {
    const { createEvent } = useEventSubscriber([], []);
    const process = (game: GameModel) => {
        const event: EventModel = { name: "initGame", topic: "model", data: JSON.parse(JSON.stringify(game)), delay: 0 }
        createEvent(event);

    }


    useEffect(() => {

    }, [])
    return { process }

}
export default useInitGameProcessor
