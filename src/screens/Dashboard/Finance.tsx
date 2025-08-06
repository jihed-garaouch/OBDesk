import AddFinanceModal from "@/components/Dashboard/Finance/AddFinanceModal";
import FinanceDetailsCard from "@/components/Dashboard/Finance/FinanceDetailsCard";
import FinanceSummaryCard from "@/components/Dashboard/Finance/FinanceSummaryCard";
import PieChartBreakdown from "@/components/ui/PieChartBreakdown";
import { UseFinance } from "@/context/FinanceContext";

const FinanceScreen = () => {
	const {
		selectedDropdownOption,
		setSelectedDropdownOption,
		showBalance,
		setShowBalance,
		transactions,
		setShowFinanceModal,
		showFinanceModal,
	} = UseFinance();

	const totalIncome =
		transactions
			.filter(
				(t) =>
					t.transactionType === "income" &&
					t.date.split(" ")[1] === selectedDropdownOption.summaryMonth &&
					t.date.split(" ")[2] === selectedDropdownOption.summaryYear
			)
			.reduce((sum, t) => sum + t.amount, 0) || 0;

	const totalExpense =
		transactions
			.filter(
				(t) =>
					t.transactionType === "expense" &&
					t.date.split(" ")[1] === selectedDropdownOption.summaryMonth &&
					t.date.split(" ")[2] === selectedDropdownOption.summaryYear
			)
			.reduce((sum, t) => sum + t.amount, 0) || 0;

	return (
		<div className='h-full pr-4'>
			<h1 className='text-2xl font-bold'>Finance Tracker</h1>
			<p className='text-xs mb-6'>
				Track balances, expenses, and incoming funds with precision.
			</p>
			<div className='flex flex-col gap-5 md:gap-2'>
				<div className='flex flex-col items-start xl:flex-row xl:items-center gap-5 mb-5'>
					<div>
						<FinanceSummaryCard
							showBalance={showBalance}
							setShowBalance={setShowBalance}
						/>
					</div>
					<div className='w-full md:w-[70%] mx-auto'>
						<PieChartBreakdown
							data={[
								{ label: "Income", value: totalIncome, color: "#5A31F4" },
								{ label: "Expenses", value: totalExpense, color: "#C792F9" },
							]}
						/>
					</div>
				</div>
				<div className='flex items-start flex-wrap gap-2 md:gap-5'>
					<FinanceDetailsCard
						title='Income'
						category='income'
						selectedDropdownOption={selectedDropdownOption}
						setSelectedDropdownOption={setSelectedDropdownOption}
					/>
					<FinanceDetailsCard
						title='Expense'
						category='expense'
						selectedDropdownOption={selectedDropdownOption}
						setSelectedDropdownOption={setSelectedDropdownOption}
					/>
				</div>
			</div>
			<AddFinanceModal
				isOpen={showFinanceModal}
				onClose={() => {
					setShowFinanceModal(false);
				}}
			/>
		</div>
	);
};

export default FinanceScreen;
