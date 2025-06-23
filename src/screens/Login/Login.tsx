import Input from "@/components/ui/Input";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const LoginScreen = () => {
	const { theme } = useTheme();

	const isDarkTheme = theme === "dark";

	const [formDetails, setFormDetails] = useState({
		email: "",
		password: "",
	});

	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		console.log("Login form submitted:", formDetails);

		setFormDetails({
			email: "",
			password: "",
		});
	};

	return (
		<div className='h-svh flex w-full text-foreground bg-background'>
			<div className='flex-1 flex flex-col items-start justify-center relative'>
				<div className='px-8 w-[95%] md:w-[60%] lg:w-[70%] mx-auto z-20 backdrop-blur-xs h-full flex flex-col py-4 justify-center -mt-12'>
					<div className='flex flex-col justify-center items-center gap-1 mb-4'>
						<img
							src='/logo.webp'
							alt='logo'
							className={`w-[50px] h-[50px] border-2 rounded-full ${
								isDarkTheme ? " border-foreground" : " border-gray-400"
							}`}
						/>
						<p className='font-bold'>OrbitDesk</p>
					</div>
					<h1 className='font-bold text-xl mb-1 text-center'>Welcome Back</h1>
					<p className='font-medium text-sm mb-4 text-center'>
						Let's get you in.
					</p>
					<div className='flex flex-col gap-2'>
						<Input
							type='email'
							label='Email'
							id='email'
							value={formDetails.email}
							onChange={(e) =>
								setFormDetails({ ...formDetails, email: e.target.value })
							}
							placeholder='Enter your email'
						/>
						<Input
							type='password'
							label='Password'
							id='password'
							value={formDetails.password}
							onChange={(e) =>
								setFormDetails({ ...formDetails, password: e.target.value })
							}
							placeholder='Enter your password'
						/>
					</div>
					<button
						type='submit'
						onClick={handleSubmit}
						className={`mt-5 w-full bg-foreground text-background px-4 py-2 rounded-[4px] cursor-pointer font-bold text-sm ${
							isDarkTheme ? "hover:bg-white" : "hover:bg-black"
						} transition-all duration-300 ease-in-out`}>
						Sign in
					</button>
					<div className='mt-5 flex items-center gap-2'>
						<div className='h-[1px] w-full bg-foreground rounded-[4px] bg-gradient-to-r from-background via-foreground to-foreground' />
						<p className='uppercase text-[10px]'>or</p>
						<div className='h-[1px] w-full bg-foreground rounded-[4px] bg-gradient-to-r from-foreground via-foreground to-background' />
					</div>
					<button
						type='button'
						className='mt-5 w-full bg-transparent border border-foreground/50 text-foreground px-4 py-3 rounded-[4px] cursor-pointer font-bold text-sm flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-all duration-300 ease-in-out'>
						<FcGoogle className='text-xl' />
						<span>Sign in with Google</span>
					</button>
					<button
						type='button'
						className='mt-5 w-full bg-transparent border border-foreground/50 text-foreground px-4 py-3 rounded-[4px] cursor-pointer font-bold text-sm flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-all duration-300 ease-in-out'>
						<FaGithub className='text-xl' />
						<span>Sign in with GitHub</span>
					</button>
					<p className='mt-5 text-sm'>
						Don't have an account?{" "}
						<Link to='/sign-up' className='font-bold'>
							Create one
						</Link>
					</p>
				</div>
			</div>
			<div
				style={{ backgroundImage: `url('/login/login-bg.webp')` }}
				className='flex-1 bg-foreground hidden lg:flex bg-cover bg-center relative p-2 pb-[18rem] [@media(min-width:1440px)]:w-[50%]:pb-[15rem] justify-center items-center'>
				<div className='absolute top-0 left-0 h-full w-full bg-black/50'></div>
				<div className='relative z-10 w-[90%] [@media(min-width:1440px)]:w-[75%] text-white'>
					<p className='mb-10 text-[3rem] leading-[3.3rem] font-medium'>
						Your command center for global work.
					</p>
					<p className='text-[1rem]'>
						<span className='font-medium text-[1.3rem]'>
							Work Synchronized. Work Simplified.
						</span>{" "}
						<br />
						OrbitDesk brings your global workflow together — track time zones,
						manage finances, and stay organized across borders, all from one
						intuitive dashboard.
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginScreen;
