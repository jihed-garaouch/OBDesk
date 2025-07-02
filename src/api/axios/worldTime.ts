import { createClient } from "../createClient";

const worldTimeClient = createClient({
	baseURL: "https://worldtimeapi.org/api",
	label: "WorldTime API",
});

export default worldTimeClient;
