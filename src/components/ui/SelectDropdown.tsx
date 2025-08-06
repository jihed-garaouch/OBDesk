import { useEffect, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const defaultData = [
	{ id: 1, name: "January" },
	{ id: 2, name: "February" },
	{ id: 3, name: "March" },
	{ id: 4, name: "April" },
	{ id: 5, name: "May" },
	{ id: 6, name: "June" },
	{ id: 7, name: "July" },
	{ id: 8, name: "August" },
	{ id: 9, name: "September" },
	{ id: 10, name: "October" },
	{ id: 11, name: "November" },
	{ id: 12, name: "December" },
];

interface Option {
	id: number;
	name: string;
}

interface SelectDropdownProps {
	value: string;
	onChange: (value: string) => void;
	options?: Option[];
	className?: string;
	isRounded?: boolean;
}

const SelectDropdown = ({
	value,
	onChange,
	options = defaultData,
	className,
    isRounded=true,
}: SelectDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleSelectChange = (id: number) => {
		const selectedOption = options.find((option) => option.id === id);
		if (selectedOption) {
			onChange(selectedOption.name);
			setIsOpen(false);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const selectedValue = value;

	return (
		<div className={`relative ${className}`} ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`flex items-center justify-between gap-2 border border-foreground/30 px-3 py-1.5 ${isRounded ? "rounded-full" : "rounded-sm"}  shadow-sm hover:bg-foreground/5 transition-colors cursor-pointer w-full`}>
				<span className='text-xs md:text-sm font-light'>{selectedValue}</span>
				<LuChevronDown
					className={`w-4 h-4 transition-all duration-500 ease-in-out ${
						isOpen ? "rotate-180" : "rotate-0"
					}`}
				/>
			</button>

			{isOpen && (
				<div className='absolute top-full left-0 mt-2 w-full min-w-[100px] bg-background border border-foreground/20 rounded-lg shadow-xl z-50 max-h-60 overflow-hidden'>
					<div className='overflow-y-auto max-h-60'>
						{options.length === 0 ? (
							<div className='px-4 py-8 text-center text-sm text-foreground/50'>
								No data found.
							</div>
						) : (
							options.map((opt) => (
								<button
									key={opt.id}
									onClick={() => handleSelectChange(opt.id)}
									className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-foreground/5 transition-colors cursor-pointer ${
										selectedValue === opt.name ? "bg-foreground/10" : ""
									}`}>
									<span className='text-xs md:text-sm font-light'>
										{opt.name}
									</span>
								</button>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default SelectDropdown;
