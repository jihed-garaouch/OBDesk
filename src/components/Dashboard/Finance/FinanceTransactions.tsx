import { useState, type JSX } from "react";
import { BsFillLayersFill } from "react-icons/bs";
import { FaCar, FaGift } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";
import { GiMoneyStack, GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import {
	MdEdit,
	MdFastfood,
	MdOutlineAddCard,
	MdOutlineArrowForward,
	MdOutlineDelete,
	MdSavings,
} from "react-icons/md";
import { PiStackPlusFill } from "react-icons/pi";
import { RiHealthBookFill } from "react-icons/ri";
import SingleTransactionModal from "./SingleTransactionModal";
import { currencySymbols } from "@/utils/constants";
import { UseFinance, type TransactionType } from "@/context/FinanceContext";
import { Link } from "react-router-dom";
import DeleteTransactionModal from "./DeleteTransactionModal";
import { formatReadableBalance } from "@/utils";

interface FinanceTransactionsProps {
	transactionType: "income" | "expense";
	transactions: TransactionType[];
	isStandalone?: boolean;
}

export type TransactionTypeWithIcon = TransactionType & {
	icon: JSX.Element;
};

type TransactionCategoryIconsType = {
	[key: string]: JSX.Element;
};

const FinanceTransactions = ({
	transactionType,
	transactions,
	isStandalone,
}: FinanceTransactionsProps) => {
	const transactionCategoryIcons: TransactionCategoryIconsType = {
		salary: <GiMoneyStack />,
		gift: <FaGift />,
		refund: <GiReceiveMoney />,
		food: <MdFastfood />,
		transportation: <FaCar />,
		bills_and_utilities: <BsFillLayersFill />,
		healthcare: <RiHealthBookFill />,
		education: <FaBookOpenReader />,
		subscription: <MdOutlineAddCard />,
		savings: <MdSavings />,
		others: <GiTakeMyMoney />,
	};

	const {
		globalFinanceCurrency,
		setShowFinanceModal,
		selectedDropdownOption,
		transactionToUpdate,
		setTransactionToUpdate,
		setIsUpdateTransaction,
		handleDeleteTransaction,
	} = UseFinance();
	const [showTransactionModal, setShowTransactionModal] = useState(false);
	const [showDeleteTransactionModal, setShowDeleteTransactionModal] =
		useState(false);
	const [selectedTransaction, setSelectedTransaction] =
		useState<TransactionTypeWithIcon | null>(null);

	const mappedTransactions =
		transactionType === "income"
			? transactions.filter(
					(t) =>
						t.transactionType === "income" &&
						t.date.split(" ")[1] === selectedDropdownOption.incomeMonth &&
						t.date.split(" ")[2] === selectedDropdownOption.incomeYear
			  )
			: transactions.filter(
					(t) =>
						t.transactionType === "expense" &&
						t.date.split(" ")[1] === selectedDropdownOption.expenseMonth &&
						t.date.split(" ")[2] === selectedDropdownOption.expenseYear
			  );

	return (
		<div>
			<div className='flex justify-between items-center text-sm'>
				<p className='font-medium'>
					Recent {transactionType === "income" ? "Income" : "Expense"}:
				</p>
				{!isStandalone && (
					<Link
						to={`/dashboard/finance/${
							transactionType === "income" ? "income" : "expense"
						}`}
						className='flex items-center justify-center gap-2 text-xs md:text-sm font-medium cursor-pointer bg-black text-white border-foreground border p-2 min-w-[100px] rounded-full w-fit h-fit active:scale-95 transition-all duration-500 ease-in-out'>
						<span>View all</span>
						<MdOutlineArrowForward className='text-lg' />
					</Link>
				)}
			</div>
			<div className='mt-2 text-sm flex flex-col gap-3 max-h-[300px] overflow-y-auto'>
				{mappedTransactions.map((transaction, idx) => (
					<div
						key={idx}
						onClick={() => {
							setShowTransactionModal(true);
							setSelectedTransaction({
								...transaction,
								icon: transactionCategoryIcons[transaction.category],
							});
						}}
						className='flex justify-between items-center gap-4 hover:bg-foreground/5 p-3 rounded-[10px] cursor-pointer transition-all duration-300 ease-in-out active:scale-[0.99] lg:active:scale-[0.995]'>
						<div className='flex gap-2 items-center'>
							<div className='p-2 rounded-[10px] bg-foreground w-10 h-10 flex items-center justify-center'>
								<span className='text-background text-2xl'>
									{transactionCategoryIcons[transaction.category]}
								</span>
							</div>
							<div className='flex flex-col'>
								<p className='font-medium text-xs md:text-sm line-clamp-2 max-w-[150px] md:max-w-[200px] lg:max-w-[300px]'>
									{transaction.description}
								</p>
								<div className='flex flex-col lg:flex-row lg:items-center gap-[2px] lg:gap-1 text-[11px] lg:text-xs text-foreground/70'>
									<span className='capitalize'>
										{transaction.category.split("_").join(" ")}
									</span>
									<span className='bg-foreground h-[4px] w-[4px] rounded-full hidden lg:flex mt-[2px]'></span>
									<span>{transaction.date}</span>
									<span className='bg-foreground h-[4px] w-[4px] rounded-full hidden xl:flex mt-[2px]'></span>
									<span className='hidden xl:flex'>{transaction.time}</span>
								</div>
							</div>
						</div>
						<div className='font-medium flex flex-col md:flex-row-reverse gap-2 md:gap-5 md:items-center items-end'>
							{isStandalone && (
								<div className='flex gap-2 items-center text-base md:text-xl'>
									<span
										className='p-[6px] rounded-full bg-foreground text-background'
										onClick={(e) => {
											e.stopPropagation();
											setTransactionToUpdate(transaction);
											setShowFinanceModal(true);
											setIsUpdateTransaction(true);
										}}>
										<MdEdit />
									</span>
									<span
										onClick={(e) => {
											e.stopPropagation();
											setTransactionToUpdate(transaction);
											setShowDeleteTransactionModal(true);
										}}
										className='p-[6px] rounded-full bg-foreground text-destructive'>
										<MdOutlineDelete />
									</span>
								</div>
							)}
							<span
								className={`${
									transactionType === "income"
										? "text-success"
										: "text-destructive"
								} text-center text-xs lg:text-sm`}>
								{transactionType === "income" ? "+" : "-"}
								{currencySymbols[globalFinanceCurrency]}
								{formatReadableBalance(transaction.amount, true)}
							</span>
						</div>
					</div>
				))}
				{mappedTransactions.length === 0 && (
					<div
						onClick={() => setShowFinanceModal(true)}
						className='flex flex-col items-center gap-2 mt-4'>
						<div className='h-20 w-20 rounded-[20px] p-2 bg-foreground flex justify-center items-center active:scale-95 cursor-pointer transition-all duration-300 ease-in-out'>
							<PiStackPlusFill className='text-background text-4xl' />
						</div>
						<p className='text-sm'>
							No recent {transactionType === "income" ? "income" : "expense"}{" "}
							found
						</p>
					</div>
				)}
			</div>
			<SingleTransactionModal
				isOpen={showTransactionModal}
				onClose={() => {
					setShowTransactionModal(false);
				}}
				selectedTransaction={selectedTransaction}
			/>
			<DeleteTransactionModal
				isOpen={showDeleteTransactionModal}
				onClose={() => {
					setShowDeleteTransactionModal(false);
				}}
				onDeleteTransaction={handleDeleteTransaction}
				transactionToBeDeleted={transactionToUpdate || ({} as TransactionType)}
			/>
		</div>
	);
};

export default FinanceTransactions;
