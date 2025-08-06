import useNetworkStatus from "@/hooks/useNetworkStatus";
import {
	addToTransactionSyncQueue,
	deleteTransactionFromIndexedDB,
	getTransactionsFromIndexedDB,
	getTransactionSyncQueue,
	removeFromSyncQueue,
	saveTransactionsToIndexedDB,
	saveTransactionToIndexedDB,
	updateTransactionInIndexedDB,
} from "@/utils/indexedDb/finance";
import { supabase } from "@/utils/supabase/supabaseClient";
import { createContext, useContext, useEffect, useState } from "react";
import { UserAuth } from "./AuthContext";
import {
	addTransactionToSupabase,
	deleteTransactionFromSupabase,
	fetchUserTransactionsFromSupabase,
	updateTransactionInSupabase,
} from "@/utils/supabase/supabaseService";

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
	const { isOnline } = useNetworkStatus();
	const { session } = UserAuth();
	const user = session?.user;

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

	const [transactionToUpdate, setTransactionToUpdate] =
		useState<TransactionType | null>(null);
	const [isUpdateTransaction, setIsUpdateTransaction] =
		useState<boolean>(false);

	const handleAddTransaction = async (transaction: TransactionType) => {
		setTransactions((prev) => [...prev, transaction]);
		await saveTransactionToIndexedDB(transaction);

		if (!isOnline) {
			await addToTransactionSyncQueue({
				id: transaction.id,
				type: "create",
				table: "transactions",
				payload: transaction,
				timestamp: Date.now(),
			});
			return;
		}

		if (user) await addTransactionToSupabase(transaction, user);
	};

	const handleEditTransaction = async (transaction: TransactionType) => {
		setTransactions((prev) =>
			prev.map((t) => (t.id === transaction.id ? transaction : t))
		);
		await updateTransactionInIndexedDB(transaction);

		if (!isOnline) {
			await addToTransactionSyncQueue({
				id: transaction.id,
				type: "update",
				table: "transactions",
				payload: transaction,
				timestamp: Date.now(),
			});
			return;
		}

		if (user) await updateTransactionInSupabase(transaction, user);
	};

	const handleDeleteTransaction = async (transaction: TransactionType) => {
		setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
		await deleteTransactionFromIndexedDB(transaction);

		if (!isOnline) {
			await addToTransactionSyncQueue({
				id: transaction.id,
				type: "delete",
				table: "transactions",
				payload: transaction,
				timestamp: Date.now(),
			});
			return;
		}

		if (user) await deleteTransactionFromSupabase(transaction.id, user);
	};

	const processSyncQueue = async () => {
		const queue = await getTransactionSyncQueue();

		for (const op of queue) {
			if (!isOnline) break;

			let success = false;

			try {
				if (op.type === "create") {
					const tx = op.payload as TransactionType;
					const payload = {
						id: tx.id,
						transaction_type: tx.transactionType,
						category: tx.category,
						description: tx.description,
						amount: tx.amount,
						date: tx.date,
						time: tx.time,
						user_id: user?.id,
					};
					const { error } = await supabase.from(op.table).insert([payload]);
					if (!error) success = true;
				}

				if (op.type === "update") {
					const tx = op.payload as TransactionType;
					const payload = {
						transaction_type: tx.transactionType,
						category: tx.category,
						description: tx.description,
						amount: tx.amount,
						date: tx.date,
						time: tx.time,
						updated_at: new Date().toISOString(),
					};
					const { error } = await supabase
						.from(op.table)
						.update(payload)
						.eq("id", tx.id)
						.eq("user_id", user?.id);
					if (!error) success = true;
				}

				if (op.type === "delete") {
					const tx = op.payload as { id: string };
					const { error } = await supabase
						.from(op.table)
						.delete()
						.eq("id", tx.id)
						.eq("user_id", user?.id);
					if (!error) success = true;
				}
			} catch (err) {
				console.error("Offline transaction sync error:", err);
			}

			if (success) {
				await removeFromSyncQueue(op.id);
			} else {
				console.warn("Sync failed for transaction operation:", op);
			}
		}
	};

	const loadTransactions = async () => {
		if (isOnline) {
			await processSyncQueue();
		}

		let savedTransactions: TransactionType[] = [];
		if (isOnline && user) {
			savedTransactions = await fetchUserTransactionsFromSupabase(user);

			// Update IndexedDB with Batch Write
			await saveTransactionsToIndexedDB(savedTransactions);
		} else {
			savedTransactions = await getTransactionsFromIndexedDB();
		}

		setTransactions(savedTransactions);
	};

	useEffect(() => {
		if (user) loadTransactions();
	}, [isOnline, user]);

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
