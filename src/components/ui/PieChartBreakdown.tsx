import { UseFinance } from "@/context/FinanceContext";
import { formatReadableBalance } from "@/utils";
import { currencySymbols } from "@/utils/constants";
import { PieChart, Pie, Cell } from "recharts";

export interface ChartItem {
	label: string;
	value: number;
	color?: string | undefined;
	[key: string]: string | number | undefined;
}

interface PieChartBreakdownProps {
	title?: string;
	data: ChartItem[];
	isStandalone?: boolean;
}

const PieChartBreakdown = ({
	title = "Total Balance",
	data,
	isStandalone,
}: PieChartBreakdownProps) => {
	if (data.length === 0) return null;

	const total = data.reduce((sum, item) => sum + item.value, 0);
	const balance = data
		.slice(1)
		.reduce((sum, item) => sum - item.value, data[0].value);
	const { globalFinanceCurrency, showBalance } = UseFinance();

	const transactionCategoryColorCode: { [key: string]: string } = {
		salary: "#5A31F4", 
		gift: "#C792F9",
		refund: "#00C49F", 
		food: "#FF7043", 
		transportation: "#FFBB28", 
		bills_and_utilities: "#4FC3F7", 
		healthcare: "#E57373", 
		education: "#81C784", 
		subscription: "#BA68C8",
		others: "#FFD54F", 
	};

	return (
		<div
			className={`flex ${
				isStandalone
					? "flex-col items-center"
					: "flex-col xl:flex-row items-center xl:items-start"
			} gap-6 w-full`}>
			{/* Donut Pie Chart */}
			<div className='relative'>
				<PieChart width={300} height={300}>
					<Pie
						data={data}
						dataKey='value'
						nameKey='label'
						cx='50%'
						cy='50%'
						innerRadius={120}
						outerRadius={140}
						className='w-full h-full'
						stroke='none'>
						{data.map((entry, i) => (
							<Cell
								key={i}
								fill={entry.color || transactionCategoryColorCode[entry.label]}
							/>
						))}
					</Pie>
				</PieChart>

				{/* Center Text */}
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center'>
					<p className='text-foreground text-lg'>{title}</p>
					<p className='text-[36px] font-bold'>
						{currencySymbols[globalFinanceCurrency]}
						{isStandalone
							? formatReadableBalance(total)
							: showBalance
							? formatReadableBalance(balance)
							: "********"}
					</p>
				</div>
			</div>

			{/* Legend */}
			<div className='flex flex-wrap justify-center gap-4'>
				{data.map((d) => (
					<div key={d.label} className='flex items-center gap-2'>
						<div
							className='w-3 h-3 rounded-full'
							style={{
								background: d.color || transactionCategoryColorCode[d.label],
							}}
						/>
						<span className='text-sm capitalize'>
							{d.label.split("_").join(" ")}
						</span>
					</div>
				))}
			</div>

			{/* Breakdown Section */}
			<div className='w-full flex flex-col gap-4'>
				{data.map((d) => {
					const percent =
						total === 0 ? 0 : ((d.value / total) * 100).toFixed(2);

					return (
						<div key={d.label} className='w-full text-sm'>
							<div className='flex justify-between mb-1'>
								<span className='font-medium capitalize'>
									{d.label.split("_").join(" ")}
								</span>
								<span className='text-foreground'>
									{currencySymbols[globalFinanceCurrency]}
									{isStandalone
										? formatReadableBalance(d.value)
										: showBalance
										? formatReadableBalance(d.value)
										: "********"}{" "}
									{" | "} {percent}%
								</span>
							</div>

							{/* Progress Bar */}
							<div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
								<div
									className='h-full rounded-full'
									style={{
										width: `${percent}%`,
										background:
											d.color || transactionCategoryColorCode[d.label],
									}}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default PieChartBreakdown;
