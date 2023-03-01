import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Subject } from "rxjs";
export declare type EventModel = {
  name: string;
  data: any | undefined;
};
export interface IContextProps {
  subject: Subject<EventModel> | null;
}

export const EventContext = createContext<IContextProps>({
  subject: null,
} as IContextProps);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const subject = new Subject<EventModel>();
  return <EventContext.Provider value={{ subject: subject }}>{children}</EventContext.Provider>;
};

const useEventSubscriber = (selectors: string[]) => {
  const [event, setEvent] = useState<EventModel | null>(null);
  const { subject } = useContext(EventContext);
  useEffect(() => {
    if (selectors && selectors.length > 0 && subject) {
      const observable = subject.asObservable();
      const subscription = observable.subscribe((event: EventModel) => {
        if (selectors?.includes(event.name)) setEvent(event);
      });
      return () => subscription.unsubscribe();
    }
  }, [selectors, subject]);

  const createEvent = useCallback(
    (event: EventModel) => {
      if (subject) subject.next(event);
    },
    [subject]
  );
  return { event, createEvent };
};
export default useEventSubscriber;
