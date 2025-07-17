import { useEffect, useRef, useState } from "react";
import { LuChevronDown, LuSearch } from "react-icons/lu";
import CryptoIcon from "./CryptoIcon";

interface Crypto {
	id: string;
	name: string;
	symbol: string;
	iconUrl: string;
}

interface CryptoDropdownProps {
	value: string;
	onChange: (id: string) => void;
	cryptos: Crypto[];
}

const CryptoDropdown = ({ value, onChange, cryptos }: CryptoDropdownProps) => {
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

	const filteredCryptos = cryptos.filter(
		(crypto) =>
			crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Find the current crypto by ID
	const currentCrypto = cryptos.find((c) => c.id === value);
	const displaySymbol = currentCrypto?.symbol || value.toUpperCase();

	return (
		<div className='relative' ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='flex items-center gap-2 border border-foreground/30 px-3 py-1.5 rounded-full shadow-sm hover:bg-foreground/5 transition-colors cursor-pointer'>
				<CryptoIcon symbol={displaySymbol} cryptos={cryptos} />
				<span className='text-xs md:text-sm font-light'>{displaySymbol}</span>
				<LuChevronDown
					className={`w-4 h-4 transition-all duration-500 ease-in-out ${
						isOpen ? "rotate-180" : "rotate-0"
					}`}
				/>
			</button>

			{isOpen && (
				<div className='absolute top-full left-0 mt-2 w-64 bg-background border border-foreground/20 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden'>
					<div className='p-2 border-b border-foreground/10 sticky top-0 bg-background'>
						<div className='flex items-center gap-2 px-3 py-1.5 border border-foreground/30 rounded-full'>
							<LuSearch className='w-4 h-4 text-foreground/50' />
							<input
								type='text'
								placeholder='Search crypto...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='flex-1 bg-transparent outline-none text-sm'
								autoFocus
							/>
						</div>
					</div>

					<div className='overflow-y-auto max-h-64'>
						{filteredCryptos.map((crypto) => (
							<button
								key={crypto.id}
								onClick={() => {
									onChange(crypto.id);
									setIsOpen(false);
									setSearchTerm("");
								}}
								className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-foreground/5 transition-colors cursor-pointer ${
									value === crypto.id ? "bg-foreground/10" : ""
								}`}>
								<CryptoIcon symbol={crypto.symbol} cryptos={cryptos} />
								<span className='text-sm font-medium'>{crypto.name}</span>
								<span className='ml-auto text-xs text-foreground/60 uppercase'>
									{crypto.symbol}
								</span>
							</button>
						))}
						{filteredCryptos.length === 0 && (
							<div className='px-4 py-8 text-center text-sm text-foreground/50'>
								No cryptocurrencies found
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default CryptoDropdown;