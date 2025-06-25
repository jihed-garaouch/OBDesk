import Input from "@/components/ui/Input";
import { UseTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { UserAuth } from "@/context/AuthContext";
import { LoaderIcon } from "@/vectors/loader";

const signUpSchema = z.object({
	firstName: z.string().min(3, "First name is required"),
	lastName: z.string().min(3, "Last name is required"),
	email: z.email("Please enter a valid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignUpScreen = () => {
	const { theme } = UseTheme();
	const navigate = useNavigate();

	const isDarkTheme = theme === "dark";

	const [loading, setLoading] = useState<boolean>(false);
	const [formDetails, setFormDetails] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});

	const [errors, setErrors] = useState<{
		firstName?: string;
		lastName?: string;
		email?: string;
		password?: string;
	}>({});

	const { signUpWithEmail, signInWithGoogle } = UserAuth();

	const handleChange =
		<K extends keyof typeof formDetails>(key: K) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setFormDetails((prev) => ({ ...prev, [key]: newValue }));

			const fieldSchema = {
				firstName: z.string().min(2, "First name is required"),
				lastName: z.string().min(2, "Last name is required"),
				email: z.email("Please enter a valid email"),
				password: z.string().min(6, "Password must be at least 6 characters"),
			}[key];

			// Validate just this field
			const result = fieldSchema.safeParse(newValue);

			setErrors((prev) => ({
				...prev,
				[key]: result.success ? undefined : result.error.issues[0]?.message,
			}));
		};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const parsed = signUpSchema.safeParse(formDetails);
		if (!parsed.success) {
			// flatten field errors from zod
			const fieldErrors = parsed.error.flatten().fieldErrors;
			setErrors({
				firstName: fieldErrors.firstName?.[0],
				lastName: fieldErrors.lastName?.[0],
				email: fieldErrors.email?.[0],
				password: fieldErrors.password?.[0],
			});
			return;
		}

		// clear any previous errors
		setErrors({});
		setLoading(true);

		try {
			const { email, password, firstName, lastName } = parsed.data;
			const res = await signUpWithEmail({
				email,
				password,
				metadata: {
					first_name: firstName,
					last_name: lastName,
				},
			});

			if (!res.success) {
				const errMsg = String(res.error ?? "Sign up failed");
				toast.error(errMsg);
				return;
			}

			navigate("/");

			setFormDetails({
				firstName: "",
				lastName: "",
				email: "",
				password: "",
			});
		} catch (err) {
			toast.error("Something went wrong");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='h-svh flex w-full text-foreground bg-background'>
			<div className='flex-1 flex flex-col items-start justify-center relative'>
				<div className='px-8 w-[95%] md:w-[60%] lg:w-[70%] mx-auto z-20 backdrop-blur-xs h-full flex flex-col py-4 justify-center'>
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
					<h1 className='font-bold text-xl mb-1 text-center'>
						Create your Account
					</h1>
					<p className='font-medium text-sm mb-4 text-center'>
						Please fill in your details to get started.
					</p>
					<form onSubmit={handleSubmit} className='flex flex-col gap-2'>
						<Input
							type='text'
							label='First Name'
							id='firstName'
							value={formDetails.firstName}
							onChange={handleChange("firstName")}
							placeholder='Enter your first name'
						/>
						{errors.firstName && (
							<p className='text-xs text-red-500'>{errors.firstName}</p>
						)}

						<Input
							type='text'
							label='Last Name'
							id='lastName'
							value={formDetails.lastName}
							onChange={handleChange("lastName")}
							placeholder='Enter your last name'
						/>
						{errors.lastName && (
							<p className='text-xs text-red-500'>{errors.lastName}</p>
						)}

						<Input
							type='email'
							label='Email'
							id='email'
							value={formDetails.email}
							onChange={handleChange("email")}
							placeholder='Enter your email'
						/>
						{errors.email && (
							<p className='text-xs text-red-500'>{errors.email}</p>
						)}

						<Input
							type='password'
							label='Password'
							id='password'
							value={formDetails.password}
							onChange={handleChange("password")}
							placeholder='Enter your password'
						/>
						{errors.password && (
							<p className='text-xs text-red-500'>{errors.password}</p>
						)}

						<button
							disabled={loading}
							type='submit'
							className={`mt-5 w-full bg-foreground text-background px-4 py-2 rounded-[4px] cursor-pointer font-bold text-sm ${
								isDarkTheme ? "hover:bg-white" : "hover:bg-black"
							} transition-all duration-300 ease-in-out flex justify-center items-center`}>
							{loading ? (
								<LoaderIcon className='h-3 w-3 animate-spin stroke-background' />
							) : (
								"Sign up"
							)}
						</button>
					</form>
					<div className='mt-5 flex items-center gap-2'>
						<div className='h-[1px] w-full bg-foreground rounded-[4px] bg-gradient-to-r from-background via-foreground to-foreground' />
						<p className='uppercase text-[10px]'>or</p>
						<div className='h-[1px] w-full bg-foreground rounded-[4px] bg-gradient-to-r from-foreground via-foreground to-background' />
					</div>
					<button
						type='button'
						onClick={signInWithGoogle}
						className='mt-5 w-full bg-transparent border border-foreground/50 text-foreground px-4 py-3 rounded-[4px] cursor-pointer font-bold text-sm flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-all duration-300 ease-in-out'>
						<FcGoogle className='text-xl' />
						<span>Sign up with Google</span>
					</button>
					<button
						type='button'
						className='mt-5 w-full bg-transparent border border-foreground/50 text-foreground px-4 py-3 rounded-[4px] cursor-pointer font-bold text-sm flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-all duration-300 ease-in-out'>
						<FaGithub className='text-xl' />
						<span>Sign up with GitHub</span>
					</button>
					<p className='mt-5 text-sm'>
						Already have an account?{" "}
						<Link to='/login' className='font-bold'>
							Sign in
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

export default SignUpScreen;
