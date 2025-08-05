import { createContext, useContext, useEffect, useState } from "react";

export type SelectedDropdownOption = {
	incomeMonth: string;
	expenseMonth: string;
	incomeYear: string;
	expenseYear: string;
	summaryMonth: string;
	summaryYear: string;
};

export type TransactionType = {
	id: string;
	transactionType: string;
	category: string;
	description: string;
	amount: number;
	date: string;
	time: string;
};

interface FinanceContextType {
	showBalance: boolean;
	setShowBalance: React.Dispatch<React.SetStateAction<boolean>>;
	showFinanceModal: boolean;
	setShowFinanceModal: React.Dispatch<React.SetStateAction<boolean>>;
	selectedDropdownOption: SelectedDropdownOption;
	setSelectedDropdownOption: React.Dispatch<
		React.SetStateAction<SelectedDropdownOption>
	>;
	transactions: TransactionType[];
	setTransactionToUpdate: React.Dispatch<
		React.SetStateAction<TransactionType | null>
	>;
	transactionToUpdate: TransactionType | null;
	globalFinanceCurrency: string;
	setGlobalFinanceCurrency: React.Dispatch<React.SetStateAction<string>>;
	handleAddTransaction: (transaction: TransactionType) => void;
	handleEditTransaction: (transaction: TransactionType) => void;
	handleDeleteTransaction: (transaction: TransactionType) => void;
	isUpdateTransaction: boolean;
	setIsUpdateTransaction: React.Dispatch<React.SetStateAction<boolean>>;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export const FinanceProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [globalFinanceCurrency, setGlobalFinanceCurrency] = useState<string>(
		localStorage.getItem("globalFinanceCurrency") || "USD"
	);
	const [showFinanceModal, setShowFinanceModal] = useState<boolean>(false);
	const [showBalance, setShowBalance] = useState<boolean>(true);

	const defaultMonth = new Intl.DateTimeFormat("en-US", {
		month: "long",
	}).format(new Date());

	const defaultYear = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
	}).format(new Date());

	const [selectedDropdownOption, setSelectedDropdownOption] =
		useState<SelectedDropdownOption>({
			incomeMonth: defaultMonth,
			expenseMonth: defaultMonth,
			summaryMonth: defaultMonth,
			incomeYear: defaultYear,
			expenseYear: defaultYear,
			summaryYear: defaultYear,
		});
	const [transactions, setTransactions] = useState<TransactionType[]>([
		{
			id: "1",
			date: "3rd December 2025",
			description: "Salary",
			amount: 350000,
			category: "salary",
			transactionType: "income",
			time: "12:33 PM",
		},
		{
			id: "2",
			date: "1st December 2025",
			description: "Salary",
			amount: 350000,
			category: "salary",
			transactionType: "income",
			time: "12:33 PM",
		},
		{
			id: "3",
			date: "4th December 2025",
			description: "Salary",
			amount: 350000,
			category: "salary",
			transactionType: "income",
			time: "10:33 PM",
		},
		{
			id: "4",
			date: "2nd December 2025",
			description: "Salary",
			amount: 350000,
			category: "salary",
			transactionType: "income",
			time: "12:33 PM",
		},
		{
			id: "5",
			date: "2nd December 2025",
			description: "Salary",
			amount: 350000,
			category: "salary",
			transactionType: "income",
			time: "10:33 PM",
		},
		{
			id: "6",
			date: "2nd December 2025",
			description: "Salary",
			amount: 350000,
			category: "salary",
			transactionType: "income",
			time: "10:33 AM",
		},
	]);

	const [transactionToUpdate, setTransactionToUpdate] =
		useState<TransactionType | null>(null);
	const [isUpdateTransaction, setIsUpdateTransaction] =
		useState<boolean>(false);

	const handleAddTransaction = (transaction: TransactionType) => {
		setTransactions((prev) => [...prev, transaction]);
	};

	const handleEditTransaction = (transaction: TransactionType) => {
		setTransactions((prev) =>
			prev.map((t) => (t.id === transaction.id ? transaction : t))
		);
	};

	const handleDeleteTransaction = (transaction: TransactionType) => {
		setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
	};

	useEffect(() => {
		localStorage.setItem("globalFinanceCurrency", globalFinanceCurrency);
	}, [globalFinanceCurrency]);

	const values = {
		transactions,
		selectedDropdownOption,
		setSelectedDropdownOption,
		showBalance,
		setShowBalance,
		globalFinanceCurrency,
		setGlobalFinanceCurrency,
		showFinanceModal,
		setShowFinanceModal,
		handleAddTransaction,
		handleEditTransaction,
		handleDeleteTransaction,
		transactionToUpdate,
		setTransactionToUpdate,
		isUpdateTransaction,
		setIsUpdateTransaction,
	};

	return (
		<FinanceContext.Provider value={values}>{children}</FinanceContext.Provider>
	);
};

export const UseFinance = () => {
	const ctx = useContext(FinanceContext);
	if (!ctx)
		throw new Error("UseFinance must be used within FinanceContextProvider");
	return ctx;
};
