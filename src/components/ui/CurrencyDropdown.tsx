import type { Currency } from "@/context/CurrencyContext";
import { useEffect, useRef, useState } from "react";
import { LuChevronDown, LuSearch } from "react-icons/lu";
import Flag from "./Flag";

interface CurrencyDropdownProps {
	value: string;
	onChange: (value: string) => void;
	currencies: Currency[];
	isLeft?: boolean;
}
const CurrencyDropdown = ({
	value,
	onChange,
	currencies,
	isLeft = true,
}: CurrencyDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
				setSearchTerm("");
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const filteredCurrencies = currencies.filter((currency) =>
		currency.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className='relative' ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='flex items-center gap-2 border border-foreground/30 px-3 py-1.5 rounded-full shadow-sm hover:bg-foreground/5 transition-colors cursor-pointer'>
				<Flag currencyCode={value} />
				<span className='text-xs md:text-sm font-light'>{value}</span>
				<span>
					<LuChevronDown
						className={`w-4 h-4 transition-all duration-500 ease-in-out ${
							isOpen ? "rotate-180" : "rotate-0"
						}`}
					/>
				</span>
			</button>

			{isOpen && (
				<div
					className={`absolute top-full ${
						isLeft ? "left-0" : "right-0"
					} mt-2 w-64 bg-background border border-foreground/20 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden`}>
					<div className='p-2 border-b border-foreground/10 sticky top-0 bg-background'>
						<div className='flex items-center gap-2 px-3 py-1.5 border border-foreground/30 rounded-full'>
							<LuSearch className='w-4 h-4 text-foreground/50' />
							<input
								type='text'
								placeholder='Search currency...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='flex-1 bg-transparent outline-none text-sm'
								autoFocus
							/>
						</div>
					</div>
					<div className='overflow-y-auto max-h-64'>
						{filteredCurrencies.map((currency) => (
							<button
								key={currency.name}
								onClick={() => {
									onChange(currency.name);
									setIsOpen(false);
									setSearchTerm("");
								}}
								className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-foreground/5 transition-colors cursor-pointer ${
									value === currency.name ? "bg-foreground/10" : ""
								}`}>
								<Flag currencyCode={currency.name} />
								<span className='text-sm font-medium'>{currency.name}</span>
							</button>
						))}
						{filteredCurrencies.length === 0 && (
							<div className='px-4 py-8 text-center text-sm text-foreground/50'>
								No currencies found
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default CurrencyDropdown;
