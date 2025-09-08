import MiniCurrency from "@/components/Dashboard/Currency/MiniCurrency";
import FinanceSummaryCard from "@/components/Dashboard/Finance/FinanceSummaryCard";
import MiniTaskManager from "@/components/Dashboard/TaskManager/MiniTaskManager";
import MiniWorldClock from "@/components/Dashboard/WorldClock/MiniWorldClock";
import Skeleton from "@/components/ui/Skeleton";
import { UserAuth } from "@/context/AuthContext";
import { UseFinance } from "@/context/FinanceContext";
import { UseTheme } from "@/context/ThemeContext";
import { UseWorldClock } from "@/context/WorldClockContext";

const HomeScreen = () => {
	const { user } = UserAuth();
	const { timeZones } = UseWorldClock();
	const { setShowBalance, showBalance } = UseFinance();

	const { theme } = UseTheme();
	const isDark = theme === "dark";

	const firstName = user?.first_name;
	const fullName = user?.full_name;

	return (
		<div className='pr-4 overflow-x-hidden h-full'>
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
			<div className='flex flex-col xl:flex-row gap-3'>
				<div className='flex-[1.5]'>
					{timeZones.length === 0 ? (
						<div className='mb-4'>
							<Skeleton />
						</div>
					) : (
						<div
							className={`mb-4 py-4 px-6 border bg-background border-foreground/20 border-foreground-20 w-fit rounded-[20px] ${
								isDark
									? "shadow-[inset_0_2px_10px_rgba(255,255,255,0.10),0_2px_10px_rgba(0,0,0,0.16)]"
									: "shadow-lg"
							}`}>
							<MiniWorldClock />
						</div>
					)}
					<div className='mb-4 w-full flex flex-col gap-5 md:flex-row rounded-[20px]'>
						<div className='flex-[1] h-fit'>
							<MiniCurrency />
						</div>
						<div className='flex-[1] h-fit'>
							<FinanceSummaryCard
								showBalance={showBalance}
								setShowBalance={setShowBalance}
								isWidget
							/>
						</div>
					</div>
				</div>
				<div
					className={`flex-[1] mb-4 py-4 px-4 md:px-6 border bg-background border-foreground/20 border-foreground-20 w-full rounded-[20px] ${
						isDark
							? "shadow-[inset_0_2px_10px_rgba(255,255,255,0.10),0_2px_10px_rgba(0,0,0,0.16)]"
							: "shadow-lg"
					}`}>
					<MiniTaskManager />
				</div>
			</div>
		</div>
	);
};

export default HomeScreen;
