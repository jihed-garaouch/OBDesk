import MiniWorldClock from "@/components/Dashboard/MiniWorldClock";
import { UserAuth } from "@/context/AuthContext";

const HomeScreen = () => {
	const { user } = UserAuth();

	const firstName = user?.first_name;
	const fullName = user?.full_name;

	return (
		<div className=''>
			<div className='flex flex-col gap-1 mb-6'>
				<h1 className='text-2xl font-bold'>
					Welcome back,{" "}
					{firstName ||
						(typeof fullName === "string"
							? fullName.split(" ")[0]
							: undefined) ||
						user?.email}
					👋
				</h1>
				<p className='text-xs'>Here is your workspace overview.</p>
			</div>
			<div className="mb-4">
				<MiniWorldClock />
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{/* Sample Dashboard Cards */}
				<div className='p-4 border border-[var(--border)] rounded-lg'>
					<h3 className='font-medium mb-2'>Quick Stats</h3>
					<p className='text-sm opacity-75'>
						Your dashboard overview goes here
					</p>
				</div>
				{/* Add more cards as needed */}
			</div>
		</div>
	);
};

export default HomeScreen;
