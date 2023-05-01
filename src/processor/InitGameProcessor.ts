import { useEffect } from "react";
import { ActionTurn } from "../model/types/ActionTurn";
import Constants from "../model/types/Constants";
import { GameModel } from "../model/types/Game";
import useEventSubscriber, { EventModel } from "../service/EventManager";
import useEventService from "../service/EventService";
import useGameEngine from "../service/GameEngine";
import useTurnService from "../service/TurnService";


const useInitGameProcessor = () => {

    const turnService = useTurnService();
    const gameEngine = useGameEngine();
    const eventService = useEventService();
    const process = (game: GameModel) => {
        game.cards=gameEngine.shuffle();

        const event: EventModel = { name: "initGame", topic: "model", data: JSON.parse(JSON.stringify(game)), delay: 0 }
        // createEvent(event);
        eventService.sendEvent(event)
        const actionTurn: ActionTurn = { id: Date.now() + 2,gameId:game.gameId, round: 0, acts: [], expireTime: Date.now() + Constants.TURN_INTERVAL + 500, seat: -1, data: null }
        game.currentTurn = actionTurn;
        game.round=0;
        turnService.newActionTurn(actionTurn,100);

    }


    useEffect(() => {

    }, [])
    return { process }

}
export default useInitGameProcessor
