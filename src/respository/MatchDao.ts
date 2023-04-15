import { MatchModel } from "../model/types/Match";

export const useMatchDao = () => {

  const updateMatch = (data: any) => {
    if (typeof window !== "undefined") {
      const matchestr = window.localStorage.getItem("matches");
      if (typeof matchestr != "undefined" && matchestr != null) {
        let matches = JSON.parse(matchestr);
        if (matches?.length > 0) {
          const match = matches.find((t: MatchModel) => t.id === data.id);
          Object.assign(match, data);
          window.localStorage.setItem("matches", JSON.stringify(matches));
        }
      }
    }
  }
  const createMatch = (data: any) => {
    if (typeof window !== "undefined") {
      const matchestr = window.localStorage.getItem("matches");
      if (typeof matchestr != "undefined" && matchestr != null) {
        let matches = JSON.parse(matchestr);
        if (!matches)
          matches = [];
        matches.push(data);
        window.localStorage.setItem("matches", JSON.stringify(matches));
      }
    }
  }

  const findMatch = (id: number) => {
    if (typeof window !== "undefined") {
      const matchests = window.localStorage.getItem("matches");
      if (typeof matchests != "undefined" && matchests != null) {
        const matches = JSON.parse(matchests);
        if (matches?.length > 0)
          return matches.find((t: MatchModel) => t.id === id);
      }
    }
    return null;
  }

  return { findMatch, createMatch, updateMatch }
}

export default useMatchDao
