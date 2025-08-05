import Input from "@/components/ui/Input";
import SelectDropdown from "@/components/ui/SelectDropdown";
import { UseFinance } from "@/context/FinanceContext";
import { UseTheme } from "@/context/ThemeContext";
import { formatReadableDate } from "@/utils";
import { LoaderIcon } from "@/vectors/loader";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

const AddFinanceModal = ({
	isOpen,
	onClose,
}: // selectedTransaction,
{
	isOpen: boolean;
	onClose: () => void;
	// selectedTransaction: TransactionTypeWithIcon | null;
}) => {
	const [formDetails, setFormDetails] = useState({
		id: "",
		date: "",
		description: "",
		amount: "",
		category: "Select Category",
		transactionType: "Select Transaction Type",
		time: "",
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { theme } = UseTheme();
	const isDarkTheme = theme === "dark";

	const { handleAddTransaction } = UseFinance();

	const handleSubmit = () => {
		setIsLoading(true);
		try {
			const newTransaction = {
				...formDetails,
				id: crypto.randomUUID(),
				date: formatReadableDate(formDetails.date),
				time: new Date().toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
				}),
				amount: Number(Number(formDetails.amount).toFixed(2)) || 0,
				transactionType: formDetails.transactionType.toLowerCase(),
				category: formDetails.category.toLowerCase(),
			};
			handleAddTransaction(newTransaction);
		} catch (err) {
			console.error("Failed to add transaction:", err);
		} finally {
			setFormDetails({
				id: "",
				date: "",
				description: "",
				amount: "",
				category: "Select Category",
				transactionType: "Select Transaction Type",
				time: "",
			});
			setIsLoading(false);
			onClose();
		}
	};

	if (!isOpen) return null;
	return (
		<div
			onClick={onClose}
			className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999]'>
			<div
				onClick={(e) => e.stopPropagation()}
				className='bg-background/90 rounded-2xl border border-foreground/20 w-[90%] max-w-md p-4 shadow-lg text-foreground relative z-[1000]'>
				{/* Close Button */}
				<button
					onClick={onClose}
					className='absolute top-3 right-3 text-foreground/60 hover:text-foreground transition-all cursor-pointer'>
					<IoClose size={22} />
				</button>
				<div>
					<p className='font-bold text-lg'>Add Transaction</p>
					<div className='mt-5 flex flex-col gap-3'>
						<Input
							id='date'
							label='Date'
							type='date'
							onChange={(e) => {
								setFormDetails({ ...formDetails, date: e.target.value });
							}}
							value={formDetails.date}
						/>
						<Input
							id='description'
							label='Description'
							placeholder='E.g. Bought a new car'
							type='text'
							onChange={(e) => {
								setFormDetails({ ...formDetails, description: e.target.value });
							}}
							value={formDetails.description}
						/>
						<Input
							id='amount'
							label='Amount'
							placeholder='E.g. 1500'
							type='number'
							onChange={(e) => {
								setFormDetails({ ...formDetails, amount: e.target.value });
							}}
							value={formDetails.amount}
						/>
						<div className='flex flex-col gap-1'>
							<p className='text-sm font-bold'>Category</p>
							<SelectDropdown
								value={formDetails.category}
								onChange={(val) => {
									setFormDetails({ ...formDetails, category: val });
								}}
								isRounded={false}
								options={[
									"Salary",
									"Gift",
									"Refund",
									"Food",
									"Transportation",
									"Bills And Utilities",
									"Healthcare",
									"Education",
									"Subscription",
									"Others",
								].map((category, idx) => ({ id: idx + 1, name: category }))}
							/>
						</div>
						<div className='flex flex-col gap-1'>
							<p className='text-sm font-bold'>Transaction Type</p>
							<SelectDropdown
								value={formDetails.transactionType}
								onChange={(val) => {
									setFormDetails({ ...formDetails, transactionType: val });
								}}
								isRounded={false}
								options={[
									{ id: 1, name: "Income" },
									{ id: 2, name: "Expense" },
								]}
							/>
						</div>
					</div>
				</div>
				<button
					disabled={isLoading}
					type='button'
					onClick={handleSubmit}
					className={`active:scale-95 mt-5 w-full bg-foreground text-background px-4 py-2 rounded-[4px] cursor-pointer font-bold text-sm ${
						isDarkTheme ? "hover:bg-white" : "hover:bg-black"
					} transition-all duration-500 ease-in-out flex justify-center items-center`}>
					{isLoading ? (
						<LoaderIcon className='h-3 w-3 animate-spin stroke-background' />
					) : (
						"Submit"
					)}
				</button>
			</div>
		</div>
	);
};

export default AddFinanceModal;
