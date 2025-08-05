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
	globalFinanceCurrency: string;
	setGlobalFinanceCurrency: React.Dispatch<React.SetStateAction<string>>;
	handleAddTransaction: (transaction: TransactionType) => void;
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
	const [transactions, setTransactions] = useState<TransactionType[]>([]);

	const handleAddTransaction = (transaction: TransactionType) => {
		setTransactions((prev) => [...prev, transaction]);
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
