import HomeScreen from "@/screens/Home/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "@/screens/NotFound/NotFound";
import LoginScreen from "@/screens/Login/Login";
import SignUpScreen from "@/screens/SignUp/SignUp";
import ThemeToggle from "./components/ui/ThemeToggle";

const App = () => {
	return (
		<div className='bg-background text-foreground relative'>
			<div className='fixed right-6 bottom-8 z-50'>
				<ThemeToggle />
			</div>
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
					<Route path='/login' element={<LoginScreen />} />
					<Route path='/sign-up' element={<SignUpScreen />} />
					<Route path='*' element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
