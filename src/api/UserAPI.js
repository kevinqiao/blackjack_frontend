const HOST = "http://localhost:8080";
export const createTask = async (task) => {
  const settings = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  };
  const url = HOST + "/task/create";
  const res = await fetch(url, settings);
  const json = await res.json();
  return json;
};
export const updateTask = async (task) => {
  const settings = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  };
  const url = HOST + "/task/update";
  const res = await fetch(url, settings);
  const json = await res.json();
  return json;
};
export const removeTask = async (taskId) => {
  const res = await fetch(HOST + "/task/remove/" + taskId, { method: "DELETE" });
  const json = await res.json();
  return json;
};
export const removeAll = async () => {
  const res = await fetch(HOST + "/task/all", { method: "DELETE" });
  const json = await res.json();
  return json;
};
export const findAll = async () => {
  const res = await fetch(HOST + "/task/list");
  const json = await res.json();
  return json;
};
