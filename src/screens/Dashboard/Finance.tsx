import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { MdOutlineArrowOutward } from "react-icons/md";

const FinanceScreen = () => {
	const [showBalance, setShowBalance] = useState(true);

	return (
		<div className='h-full px-4'>
			<h1 className='text-2xl font-bold'>Finance Tracker</h1>
			<p className='text-xs mb-6'>
				Track balances, expenses, and incoming funds with precision.
			</p>
			<div className='flex'>
				<div className='mb-4 py-4 px-6 border border-foreground/20 w-full md:w-fit min-w-[300px] rounded-[20px] shadow-lg'>
					<p className='text-sm font-medium'>Total Balance</p>
					<div className='flex items-center gap-4'>
						<p className='text-[2.5rem] font-bold'>
							{showBalance ? "$134,658.12" : "********"}
						</p>
						<span
							className='text-xl cursor-pointer'
							onClick={() => setShowBalance((prev) => !prev)}>
							{showBalance ? <IoEyeOutline /> : <IoEyeOffOutline />}
						</span>
					</div>
					<div className='h-[1px] rounded-full w-full bg-foreground mb-3 mt-2'></div>
					<div className='flex justify-between gap-3'>
						<div>
							<p className='text-xs font-medium'>Income</p>
							<p className='text-[1.3rem] font-bold'>
								{showBalance ? "$14,658.12" : "********"}
							</p>
						</div>
						<div>
							<p className='text-xs font-medium'>Expense</p>
							<p className='text-[1.3rem] font-bold'>
								{showBalance ? "$14,658.12" : "********"}
							</p>
						</div>
					</div>
					<div className='mt-4'>
						<button className='flex items-center justify-center gap-2 text-xs md:text-sm font-medium cursor-pointer bg-black text-white border-foreground border p-2 min-w-[100px] rounded-full w-fit h-fit active:scale-95 transition-all duration-500 ease-in-out'>
							<span>Add</span>
							<MdOutlineArrowOutward className='text-lg' />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FinanceScreen;
