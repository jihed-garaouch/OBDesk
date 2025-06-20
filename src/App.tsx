import HomeScreen from "@/screens/Home/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "@/screens/NotFound/NotFound";

const App = () => {
	return (
		<>
			{/* Hidden image to force caching */}
			<img
				src='/offline-bg.jpg'
				alt=''
				width={1}
				height={1}
				style={{ display: "none" }}
			/>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<HomeScreen />} />
					{/* <Route path='/login' element={<Login />} /> */}
					<Route path='*' element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
};

export default App;
