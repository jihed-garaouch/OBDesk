import Input from "@/components/ui/Input";
import SelectDropdown from "@/components/ui/SelectDropdown";
import { UseFinance } from "@/context/FinanceContext";
import { UseTheme } from "@/context/ThemeContext";
import {
	formatNumberForDisplay,
	formatReadableDate,
	parseFormattedInput,
	parseReadableDateToInput,
} from "@/utils";
import { LoaderIcon } from "@/vectors/loader";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { z } from "zod";

const transactionSchema = z.object({
	date: z.string().min(1, "Date is required"),
	description: z.string().min(1, "Description is required"),
	amount: z.string().refine((val) => Number(val) > 0, {
		message: "Amount must be greater than 0",
	}),
	category: z.string().refine((val) => val !== "Select Category", {
		message: "Please select a category",
	}),
	transactionType: z
		.string()
		.refine((val) => val !== "Select Transaction Type", {
			message: "Please select a transaction type",
		}),
});

const AddFinanceModal = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
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
	const [displayAmount, setDisplayAmount] = useState("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const { theme } = UseTheme();
	const isDarkTheme = theme === "dark";

	const {
		handleAddTransaction,
		handleEditTransaction,
		transactionToUpdate,
		isUpdateTransaction,
		setIsUpdateTransaction,
		setTransactionToUpdate,
	} = UseFinance();

	const handleSubmit = () => {
		const result = transactionSchema.safeParse(formDetails);
		if (!result.success) {
			const fieldErrors: { [key: string]: string } = {};
			result.error.issues.forEach((err) => {
				const key =
					err.path && err.path.length > 0 ? String(err.path[0]) : undefined;
				if (key) fieldErrors[key] = err.message;
			});
			setErrors(fieldErrors);
			return;
		}
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
				category: formDetails.category.split(" ").join("_").toLocaleLowerCase(),
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
			setDisplayAmount("");
			setIsLoading(false);
			setErrors({});
			onClose();
		}
	};

	const handleEdit = () => {
		const result = transactionSchema.safeParse(formDetails);
		if (!result.success) {
			const fieldErrors: { [key: string]: string } = {};
			result.error.issues.forEach((err) => {
				const key =
					err.path && err.path.length > 0 ? String(err.path[0]) : undefined;
				if (key) fieldErrors[key] = err.message;
			});
			setErrors(fieldErrors);
			return;
		}
		setIsLoading(true);
		try {
			const updatedTransaction = {
				...formDetails,
				date: formatReadableDate(formDetails.date),
				time: new Date().toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
				}),
				amount: Number(Number(formDetails.amount).toFixed(2)) || 0,
				transactionType: formDetails.transactionType.toLowerCase(),
				category: formDetails.category.split(" ").join("_").toLocaleLowerCase(),
			};
			handleEditTransaction(updatedTransaction);
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
			setDisplayAmount("");
			setIsLoading(false);
			setErrors({});
			onClose();
			setIsUpdateTransaction(false);
			setTransactionToUpdate(null);
		}
	};

	useEffect(() => {
		if (!isOpen) {
			setFormDetails({
				id: "",
				date: "",
				description: "",
				amount: "",
				category: "Select Category",
				transactionType: "Select Transaction Type",
				time: "",
			});
			setDisplayAmount("");
			setErrors({});
			setIsUpdateTransaction(false);
			setTransactionToUpdate(null);
		}

		if (isOpen && transactionToUpdate && isUpdateTransaction) {
			setFormDetails({
				id: transactionToUpdate?.id || "",
				date: parseReadableDateToInput(transactionToUpdate?.date) || "",
				description: transactionToUpdate?.description || "",
				amount: String(transactionToUpdate?.amount) || "",
				category: transactionToUpdate?.category
					? transactionToUpdate.category
							.split("_")
							.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
							.join(" ")
					: "Select Category",
				transactionType: transactionToUpdate?.transactionType
					? transactionToUpdate.transactionType.charAt(0).toUpperCase() +
					  transactionToUpdate.transactionType.slice(1)
					: "Select Transaction Type",
				time: transactionToUpdate?.time || "",
			});

			setDisplayAmount(
				formatNumberForDisplay(String(transactionToUpdate?.amount))
			);
		}
	}, [isOpen]);

	const validateField = (
		field: string,
		value: string,
		allValues: typeof formDetails
	) => {
		const partial = { ...allValues, [field]: value };
		const result = transactionSchema.safeParse(partial);
		if (!result.success) {
			const issue = result.error.issues.find((err) => err.path[0] === field);
			return issue ? issue.message : "";
		}
		return "";
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
					<p className='font-bold text-lg'>
						{transactionToUpdate && isUpdateTransaction ? "Update" : "Add"}{" "}
						Transaction
					</p>
					<div className='mt-5 flex flex-col gap-3'>
						<div className='flex flex-col gap-1'>
							<Input
								id='date'
								label='Date'
								type='date'
								onChange={(e) => {
									const value = e.target.value;
									setFormDetails({ ...formDetails, date: value });
									setErrors((prev) => ({
										...prev,
										date: validateField("date", value, {
											...formDetails,
											date: value,
										}),
									}));
								}}
								value={formDetails.date}
							/>
							{errors.date && (
								<p className='text-xs text-red-500'>{errors.date}</p>
							)}
						</div>
						<div className='flex flex-col gap-1'>
							<Input
								id='description'
								label='Description'
								placeholder='E.g. Bought a new car'
								type='text'
								onChange={(e) => {
									const value = e.target.value;
									setFormDetails({ ...formDetails, description: value });
									setErrors((prev) => ({
										...prev,
										description: validateField("description", value, {
											...formDetails,
											description: value,
										}),
									}));
								}}
								value={formDetails.description}
							/>
							{errors.description && (
								<p className='text-xs text-red-500'>{errors.description}</p>
							)}
						</div>
						<div className='flex flex-col gap-1'>
							<Input
								id='amount'
								label='Amount'
								placeholder='E.g. 1500'
								type='text'
								onChange={(e) => {
									const rawValue = e.target.value;
									const cleanValue = parseFormattedInput(rawValue);
									const isNumeric = /^\d*(\.\d*)?$/.test(cleanValue);

									if (isNumeric || cleanValue === "") {
										setDisplayAmount(formatNumberForDisplay(rawValue));
										setFormDetails({ ...formDetails, amount: cleanValue });
										setErrors((prev) => ({
											...prev,
											amount: validateField("amount", cleanValue, {
												...formDetails,
												amount: cleanValue,
											}),
										}));
									}
								}}
								value={displayAmount}
							/>
							{errors.amount && (
								<p className='text-xs text-red-500'>{errors.amount}</p>
							)}
						</div>
						<div className='flex flex-col gap-1'>
							<p className='text-sm font-bold'>Category</p>
							<SelectDropdown
								value={formDetails.category}
								onChange={(val) => {
									setFormDetails({ ...formDetails, category: val });
									setErrors((prev) => ({
										...prev,
										category: validateField("category", val, {
											...formDetails,
											category: val,
										}),
									}));
								}}
								isRounded={false}
								options={[
									"Salary",
									"Gift",
									"Savings",
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
							{errors.category && (
								<span className='text-xs text-red-500'>{errors.category}</span>
							)}
						</div>
						<div className='flex flex-col gap-1'>
							<p className='text-sm font-bold'>Transaction Type</p>
							<SelectDropdown
								value={formDetails.transactionType}
								onChange={(val) => {
									setFormDetails({ ...formDetails, transactionType: val });
									setErrors((prev) => ({
										...prev,
										transactionType: validateField("transactionType", val, {
											...formDetails,
											transactionType: val,
										}),
									}));
								}}
								isRounded={false}
								options={[
									{ id: 1, name: "Income" },
									{ id: 2, name: "Expense" },
								]}
							/>
							{errors.transactionType && (
								<span className='text-xs text-red-500'>
									{errors.transactionType}
								</span>
							)}
						</div>
					</div>
				</div>
				<button
					disabled={isLoading}
					type='button'
					onClick={
						transactionToUpdate && isUpdateTransaction
							? handleEdit
							: handleSubmit
					}
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
