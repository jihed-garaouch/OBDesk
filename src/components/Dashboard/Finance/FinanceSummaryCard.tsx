import CurrencyDropdown from "@/components/ui/CurrencyDropdown";
import SelectDropdown from "@/components/ui/SelectDropdown";
import { UseCurrency } from "@/context/CurrencyContext";
import { UseFinance } from "@/context/FinanceContext";
import { formatReadableBalance, generateSmartYearOptions } from "@/utils";
import { currencySymbols } from "@/utils/constants";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { MdOutlineArrowForward, MdOutlineArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";

interface FinanceSummaryCardProps {
	showBalance: boolean;
	setShowBalance: React.Dispatch<React.SetStateAction<boolean>>;
	isWidget?: boolean;
}

const FinanceSummaryCard = ({
	showBalance,
	setShowBalance,
	isWidget = false,
}: FinanceSummaryCardProps) => {
	const { currencies } = UseCurrency();
	const {
		globalFinanceCurrency,
		setGlobalFinanceCurrency,
		setShowFinanceModal,
		selectedDropdownOption,
		setSelectedDropdownOption,
		transactions,
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

	const total = totalIncome - totalExpense;

	const selectedMonth = selectedDropdownOption.summaryMonth;

	const selectedYear = selectedDropdownOption.summaryYear;

	const yearOptions = generateSmartYearOptions(transactions);

	const handleMonthChange = (val: string) => {
		setSelectedDropdownOption((prev) => ({
			...prev,
			summaryMonth: val,
			incomeMonth: val,
			expenseMonth: val,
			incomeYear: prev.summaryYear,
			expenseYear: prev.summaryYear,
		}));
	};

	const handleYearChange = (val: string) => {
		setSelectedDropdownOption((prev) => ({
			...prev,
			summaryYear: val,
			incomeYear: val,
			expenseYear: val,
			incomeMonth: prev.summaryMonth,
			expenseMonth: prev.summaryMonth,
		}));
	};

	return (
		<div className='py-4 px-6 border border-foreground/20 w-full h-full md:min-w-[300px] max-w-[350px] rounded-[20px] shadow-lg'>
			<div className='flex gap-2 mb-4'>
				<SelectDropdown value={selectedMonth} onChange={handleMonthChange} />
				<SelectDropdown
					value={selectedYear}
					onChange={handleYearChange}
					options={yearOptions}
				/>
			</div>
			<p className='text-sm font-medium'>{`Total Balance for ${selectedMonth} ${selectedYear}`}</p>
			<div className='flex items-center gap-4'>
				<p className='text-[1.8rem] md:text-[2.5rem] font-bold overflow-auto'>
					{currencySymbols[globalFinanceCurrency]}
					{showBalance ? formatReadableBalance(total) : "********"}
				</p>
				<span
					className='text-xl cursor-pointer'
					onClick={() => setShowBalance((prev) => !prev)}>
					{showBalance ? <IoEyeOutline /> : <IoEyeOffOutline />}
				</span>
			</div>
			<div className='h-[1px] rounded-full w-full bg-foreground mb-3 mt-2'></div>
			<div className='flex items-center justify-between gap-3'>
				<div className=''>
					<p className='text-xs font-medium'>Income</p>
					<p className='text-[1rem] md:text-[1.3rem] font-bold overflow-auto'>
						{currencySymbols[globalFinanceCurrency]}
						{showBalance ? formatReadableBalance(totalIncome) : "********"}
					</p>
				</div>
				<div className=''>
					<p className='text-xs font-medium'>Expense</p>
					<p className='text-[1rem] md:text-[1.3rem] font-bold overflow-auto'>
						{currencySymbols[globalFinanceCurrency]}
						{showBalance ? formatReadableBalance(totalExpense) : "********"}
					</p>
				</div>
			</div>
			<div
				className={`${
					isWidget ? "mt-8" : "mt-4"
				} flex justify-between items-center`}>
				{isWidget ? (
					<Link
						to='/dashboard/finance'
						className='flex items-center justify-center gap-2 text-xs md:text-sm font-medium cursor-pointer bg-black text-white border-foreground border p-2 min-w-[100px] rounded-full w-fit h-fit active:scale-95 transition-all duration-500 ease-in-out'>
						<span>View all</span>
						<MdOutlineArrowForward className='text-base' />
					</Link>
				) : (
					<button
						onClick={() => setShowFinanceModal(true)}
						className='flex items-center justify-center gap-2 text-xs md:text-sm font-medium cursor-pointer bg-black text-white border-foreground border p-2 min-w-[100px] rounded-full w-fit h-fit active:scale-95 transition-all duration-500 ease-in-out'>
						<span>Add</span>
						<MdOutlineArrowOutward className='text-lg' />
					</button>
				)}

				<CurrencyDropdown
					value={globalFinanceCurrency}
					onChange={setGlobalFinanceCurrency}
					currencies={currencies}
					isLeft={false}
				/>
			</div>
		</div>
	);
};

export default FinanceSummaryCard;
