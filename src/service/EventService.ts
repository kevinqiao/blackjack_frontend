
import useEventSubscriber, { EventModel } from "./EventManager";

const useEventService = () => {
   
    const { createEvent } = useEventSubscriber([], []);
    
    const sendEvent=(event:EventModel)=>{
        createEvent(event);
    }

   return {sendEvent}
}
export default useEventService
