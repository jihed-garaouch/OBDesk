import worldTimeClient from "../axios/worldTime";

export const fetchTimezones = async () => {
  const res = await worldTimeClient.get("/timezone");
  return res.data;
};