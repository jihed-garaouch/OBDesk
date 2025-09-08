import PieChartBreakdown from "@/components/ui/PieChartBreakdown";
import SelectDropdown from "@/components/ui/SelectDropdown";
import {
	UseFinance,
	type SelectedDropdownOption,
	type TransactionType,
} from "@/context/FinanceContext";
import { currencySymbols } from "@/utils/constants";
import { MdOutlineArrowOutward } from "react-icons/md";
import FinanceTransactions from "./FinanceTransactions";
import {
	formatReadableBalance,
	generateSmartYearOptions,
	sortTransactions,
} from "@/utils";
import { UseTheme } from "@/context/ThemeContext";

interface FinanceDetailsCardProps {
	title: string;
	category: "income" | "expense";
	selectedDropdownOption: SelectedDropdownOption;
	setSelectedDropdownOption: React.Dispatch<
		React.SetStateAction<SelectedDropdownOption>
	>;
	isStandalone?: boolean;
}

const FinanceDetailsCard = ({
	title,
	category,
	selectedDropdownOption,
	setSelectedDropdownOption,
	isStandalone = false,
}: FinanceDetailsCardProps) => {
	const { theme } = UseTheme();
	const {
		globalFinanceCurrency,
		showBalance,
		setShowFinanceModal,
		transactions,
	} = UseFinance();

	const selectedMonth =
		category === "income"
			? selectedDropdownOption.incomeMonth
			: selectedDropdownOption.expenseMonth;

	const selectedYear =
		category === "income"
			? selectedDropdownOption.incomeYear
			: selectedDropdownOption.expenseYear;

	const yearOptions = generateSmartYearOptions(transactions);

	const handleMonthChange = (val: string) => {
		if (category === "income") {
			setSelectedDropdownOption((prev) => ({ ...prev, incomeMonth: val }));
		} else {
			setSelectedDropdownOption((prev) => ({ ...prev, expenseMonth: val }));
		}
	};

	const handleYearChange = (val: string) => {
		if (category === "income") {
			setSelectedDropdownOption((prev) => ({ ...prev, incomeYear: val }));
		} else {
			setSelectedDropdownOption((prev) => ({ ...prev, expenseYear: val }));
		}
	};

	const incomeTransactions =
		transactions.filter(
			(transaction) =>
				transaction.transactionType === "income" &&
				transaction.date.split(" ")[1] === selectedDropdownOption.incomeMonth &&
				transaction.date.split(" ")[2] === selectedDropdownOption.incomeYear
		) || [];

	const expenseTransactions =
		transactions.filter(
			(transaction) =>
				transaction.transactionType === "expense" &&
				transaction.date.split(" ")[1] ===
					selectedDropdownOption.expenseMonth &&
				transaction.date.split(" ")[2] === selectedDropdownOption.expenseYear
		) || [];

	const groupTransactionsByCategory = (transactions: TransactionType[]) => {
		const grouped: { [category: string]: number } = {};
		transactions.forEach((t) => {
			grouped[t.category] = (grouped[t.category] || 0) + t.amount;
		});
		return Object.entries(grouped).map(([label, value]) => ({ label, value }));
	};

	const totalIncome =
		incomeTransactions.reduce((sum, t) => sum + t.amount, 0) || 0;

	const totalExpense =
		expenseTransactions.reduce((sum, t) => sum + t.amount, 0) || 0;

	const totalBalance = category === "income" ? totalIncome : totalExpense;

	const isDark = theme === "dark";

	return (
		<div
			className={`mb-4 py-4 px-2 md:px-6 border border-foreground/20 border-foreground-20 w-full min-w-[300px] rounded-[20px] flex-[1] ${
				isDark
					? "shadow-[inset_0_2px_10px_rgba(255,255,255,0.10),0_2px_8px_rgba(0,0,0,0.16)]"
					: "shadow-lg"
			}`}>
			<div className='flex justify-between gap-3'>
				<h1 className='text-xl lg:text-2xl font-semibold'>{title}</h1>
				<div className='flex items-center gap-2'>
					<SelectDropdown value={selectedMonth} onChange={handleMonthChange} />
					<SelectDropdown
						value={selectedYear}
						onChange={handleYearChange}
						options={yearOptions}
					/>
				</div>
			</div>
			<div className='flex justify-between flex-wrap items-center gap-3 my-3'>
				<p className='text-sm lg:text-base font-normal'>
					Total Balance:{" "}
					<span className='text-xl lg:text-2xl font-medium'>
						{currencySymbols[globalFinanceCurrency]}
						{isStandalone
							? formatReadableBalance(totalBalance)
							: showBalance
							? formatReadableBalance(totalBalance)
							: "********"}
					</span>
				</p>
				{isStandalone && (
					<button
						onClick={() => setShowFinanceModal(true)}
						className='flex items-center justify-center gap-2 text-xs md:text-sm font-medium cursor-pointer bg-black text-white border-foreground border py-2 px-4 min-w-[100px] rounded-full w-fit h-fit active:scale-95 transition-all duration-500 ease-in-out'>
						<span>Add {title}</span>
						<MdOutlineArrowOutward className='text-lg' />
					</button>
				)}
			</div>
			{isStandalone && (
				<div className='w-full md:w-[70%] mx-auto mb-5'>
					<PieChartBreakdown
						title={category === "income" ? "Total Income" : "Total Expense"}
						isStandalone={isStandalone}
						data={
							category === "income"
								? groupTransactionsByCategory(incomeTransactions)
								: groupTransactionsByCategory(expenseTransactions)
						}
					/>
				</div>
			)}
			<div className='mt-3'>
				<FinanceTransactions
					isStandalone={isStandalone}
					transactionType={category}
					transactions={
						category === "income"
							? isStandalone
								? sortTransactions(incomeTransactions)
								: sortTransactions(incomeTransactions).slice(0, 4)
							: isStandalone
							? sortTransactions(expenseTransactions)
							: sortTransactions(expenseTransactions).slice(0, 4)
					}
				/>
			</div>
		</div>
	);
};

export default FinanceDetailsCard;
