import { TableModel } from "../model";

export const useTableDao = () => {


  const updateTableWithLock = (data: any, ver: number): TableModel | null => {
    let table = null;
    if (typeof window !== "undefined") {
      const tablestr = window.localStorage.getItem("tables");
      if (typeof tablestr != "undefined" && tablestr != null) {
        const tables = JSON.parse(tablestr);
        if (tables?.length > 0) {
          table = tables.find((t: TableModel) => t.id == data.id);
          if (table.ver === ver) {
            console.log("success update table")
            Object.assign(table, data, { ver: 0 });
            window.localStorage.setItem("tables", JSON.stringify(tables));
          }
        }
      }
    }
    return table;
  }
  const updateTable = (data: any) => {
    if (typeof window !== "undefined") {
      const tablestr = window.localStorage.getItem("tables");
      if (typeof tablestr != "undefined" && tablestr != null) {
        let tables = JSON.parse(tablestr);
        if (tables?.length > 0) {
          const table = tables.find((t: TableModel) => t.id === data.id);
          Object.assign(table, data);
          window.localStorage.setItem("tables", JSON.stringify(tables));
        }
      }
    }
  }
  const createTable = (data: any) => {
    if (typeof window !== "undefined") {
      let tables = []
      const tablestr = window.localStorage.getItem("tables");
      if (tablestr != null) {
        tables = JSON.parse(tablestr);
      }
      tables.push(data);
      window.localStorage.setItem("tables", JSON.stringify(tables));
    }
  }

  const findTable = (id: number): TableModel | null => {
    if (typeof window !== "undefined") {
      const tablestr = window.localStorage.getItem("tables");
      if (typeof tablestr != "undefined" && tablestr != null) {
        const tables = JSON.parse(tablestr);

        if (tables?.length > 0)
          return tables.find((t: TableModel) => t.id === id);
      }
    }
    return null;
  }
  const findAllTable = (): TableModel[] | null => {
    let tables = null;
    if (typeof window !== "undefined") {
      const tablestr = window.localStorage.getItem("tables");
      if (typeof tablestr != "undefined" && tablestr != null) {
        tables = JSON.parse(tablestr);
      }
    }
    return tables;
  }
  const findTournamentTables = (tournamentId: number): TableModel[] | null => {
    console.log("find tournament tables:" + tournamentId)
    let tables = null;
    if (typeof window !== "undefined") {
      const tablestr = window.localStorage.getItem("tables");
      if (typeof tablestr != "undefined" && tablestr != null) {
        tables = JSON.parse(tablestr);
        tables = tables.filter((t: TableModel) => t.tournamentId === tournamentId);
      }
    }
    return tables;
  }
  const findTableWithLock = (id: number): TableModel | null => {
    let table = null;
    if (typeof window !== "undefined") {
      const tablestr = window.localStorage.getItem("tables");
      if (typeof tablestr != "undefined" && tablestr != null) {
        const tables = JSON.parse(tablestr);
      
        table = tables.find((t: TableModel) => t.id === id);
      
        const past = Date.now()-table.ver;
 
        if (table != null && (table.ver === 0 || past > 400)) {
          table.ver = Date.now();
          window.localStorage.setItem("tables", JSON.stringify(tables));
          return table
        }
      }
    }
    return null;
  }
  return { findTournamentTables, findAllTable, findTable, findTableWithLock, createTable, updateTable, updateTableWithLock }
}

export default useTableDao
