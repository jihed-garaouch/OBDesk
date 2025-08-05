import AddFinanceModal from "@/components/Dashboard/Finance/AddFinanceModal";
import FinanceDetailsCard from "@/components/Dashboard/Finance/FinanceDetailsCard";
import { UseFinance } from "@/context/FinanceContext";
import { MdOutlineArrowBack } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const SingleFinanceScreen = () => {
	const {
		selectedDropdownOption,
		setSelectedDropdownOption,
		showFinanceModal,
		setShowFinanceModal,
	} = UseFinance();
	const location = useLocation();

	const transactionType =
		location.pathname.split("/").pop() === "income" ? "income" : "expense";

	return (
		<div className='h-full px-4'>
			<Link
				to='/dashboard/finance'
				className='text-sm flex gap-1 items-center mb-4'>
				<MdOutlineArrowBack className='text-lg' />
				<span>Go Back</span>
			</Link>
			<h1 className='text-2xl font-bold'>
				{transactionType === "income" ? "Income" : "Expense"} Overview
			</h1>
			<p className='text-xs mb-6'>
				Track balances, and{" "}
				{transactionType === "income" ? "incoming funds" : "expenses"} with
				precision.
			</p>
			<div>
				<FinanceDetailsCard
					title={transactionType === "income" ? "Income" : "Expense"}
					category={transactionType}
					selectedDropdownOption={selectedDropdownOption}
					setSelectedDropdownOption={setSelectedDropdownOption}
					isStandalone
				/>
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

export default SingleFinanceScreen;
