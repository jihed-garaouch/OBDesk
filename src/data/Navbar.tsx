import { FiCheckSquare, FiHome } from "react-icons/fi";
import { MdOutlineInsertChart } from "react-icons/md";
import { PiClockBold } from "react-icons/pi";

export const navItems = [
	{ path: "/dashboard", icon: <FiHome />, label: "Home" },
	{
		path: "/dashboard/world-clock",
		icon: <PiClockBold />,
		label: "World Clock",
	},
	{
		path: "/dashboard/finance",
		icon: <MdOutlineInsertChart />,
		label: "Finance",
	},
	{ path: "/dashboard/todo", icon: <FiCheckSquare />, label: "Todo" },
];
