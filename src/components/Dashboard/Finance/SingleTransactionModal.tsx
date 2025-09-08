import { IoClose } from "react-icons/io5";
import type { TransactionTypeWithIcon } from "./FinanceTransactions";
import { UseFinance } from "@/context/FinanceContext";
import { currencySymbols } from "@/utils/constants";
import { formatReadableBalance } from "@/utils";

const SingleTransactionModal = ({
	isOpen,
	onClose,
	selectedTransaction,
}: {
	isOpen: boolean;
	onClose: () => void;
	selectedTransaction: TransactionTypeWithIcon | null;
}) => {
	const { globalFinanceCurrency } = UseFinance();

	const transactionDetails = {
		"Transaction Type": selectedTransaction?.transactionType,
		Amount: selectedTransaction?.amount.toLocaleString(),
		Category: selectedTransaction?.category.split("_").join(" "),
		Date: selectedTransaction?.date,
		Time: selectedTransaction?.time,
	};

	if (!isOpen) return null;
	return (
		<div
			onClick={onClose}
			className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999]'>
			<div
				onClick={(e) => e.stopPropagation()}
				className='bg-background/90 bg-background-90 rounded-2xl border border-foreground/20 border-foreground-20 w-[90%] max-w-md p-4 shadow-lg text-foreground relative z-[1000]'>
				{/* Close Button */}
				<button
					onClick={onClose}
					className='absolute top-3 right-3 text-foreground/60 text-foreground-60 hover:text-foreground transition-all cursor-pointer'>
					<IoClose size={22} />
				</button>
				<div className='flex flex-col items-center gap-2'>
					<div className='p-2 rounded-[10px] bg-foreground w-15 h-15 flex items-center justify-center'>
						<span className='text-background text-4xl'>
							{selectedTransaction?.icon}
						</span>
					</div>
					<p
						className={`text-[2.2rem] font-bold text-center ${
							selectedTransaction?.transactionType === "income"
								? "text-success"
								: "text-destructive"
						}`}>
						{selectedTransaction?.transactionType === "income" ? "+" : "-"}
						{currencySymbols[globalFinanceCurrency]}
						{formatReadableBalance(selectedTransaction?.amount || 0, true)}
					</p>
					<p className='text-sm text-center w-[90%] max-h-[70px] overflow-auto'>
						{selectedTransaction?.description}
					</p>
				</div>
				<div className='border-foreground/15 border-foreground-15 text-sm px-4 border mt-4 rounded-[5px] flex flex-col gap-2'>
					{transactionDetails &&
						Object.entries(transactionDetails).map(([key, value], i) => (
							<div
								key={i}
								className={`flex justify-between ${
									Object.entries(transactionDetails).length - 1 !== i &&
									"border-b border-foreground/15 border-foreground-15"
								} py-3`}>
								<p className='text-foreground/70 text-foreground-70'>{key}:</p>
								<p className='font-medium capitalize'>{value}</p>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default SingleTransactionModal;
