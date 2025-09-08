import { useRef, useState } from "react";
import { IoCalendar, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { LuClock } from "react-icons/lu";
import { MdSearch } from "react-icons/md";

interface InputProps {
	type: string;
	label?: string;
	id: string;
	placeholder?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({
	type,
	label,
	id,
	placeholder,
	value,
	onChange,
}: InputProps) => {
	const [showPassWord, setShowPassWord] = useState<boolean>(false);
	const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
	const dateInputRef = useRef<HTMLInputElement>(null);
	const timeInputRef = useRef<HTMLInputElement>(null);

	const handleShowPassword = () => {
		setShowPassWord(!showPassWord);
	};

	return (
		<div className='flex flex-col gap-1 text-sm text-foreground'>
			<label htmlFor={id} className='font-bold'>
				{label}
			</label>
			{type === "search" ? (
				<div className='flex border-foreground/30 border px-4 py-2 w-full rounded-[4px] focus:outline-none'>
					<input
						id='task-search-field-99'
						type='text'
						value={value}
						onChange={onChange}
						onInput={onChange}
						placeholder={placeholder}
						readOnly={isReadOnly}
						onFocus={() => setIsReadOnly(false)}
						onBlur={() => setIsReadOnly(true)}
						className='outline-none border-0 w-full'
					/>
					<button
						type='button'
						onClick={() => dateInputRef.current?.showPicker()}
						className='text-foreground cursor-pointer w-fit active:scale-95 p-1 hover:bg-foreground hover:text-background rounded-full transition-all duration-300 ease-in-out'>
						<MdSearch size={20} />
					</button>
				</div>
			) : type === "time" ? (
				<div
					onClick={() => timeInputRef.current?.showPicker()}
					className='relative cursor-pointer'>
					<input
						id={id}
						type={type}
						ref={timeInputRef}
						value={value}
						onInput={onChange}
						onChange={onChange}
						placeholder={placeholder}
						className='border-foreground/30 border px-4 py-2 w-full rounded-[4px] focus:outline-none cursor-pointer'
					/>
					<button
						type='button'
						onClick={() => timeInputRef.current?.showPicker()}
						className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground/80 cursor-pointer'>
						<LuClock size={18} />
					</button>
				</div>
			) : type === "date" ? (
				<div
					onClick={() => dateInputRef.current?.showPicker()}
					className='relative cursor-pointer'>
					<input
						id={id}
						type={type}
						ref={dateInputRef}
						value={value}
						onInput={onChange}
						onChange={onChange}
						placeholder={placeholder}
						className='border-foreground/30 border px-4 py-2 w-full rounded-[4px] focus:outline-none cursor-pointer'
					/>
					<button
						type='button'
						onClick={() => dateInputRef.current?.showPicker()}
						className='absolute right-3 top-1/2 -translate-y-1/2 text-foreground/80 cursor-pointer'>
						<IoCalendar size={18} />
					</button>
				</div>
			) : type === "password" ? (
				<div className='border-foreground/30 border px-4 py-2 w-full rounded-[4px] flex items-center gap-3'>
					<input
						id={id}
						type={showPassWord ? "text" : "password"}
						value={value}
						onInput={onChange}
						onChange={onChange}
						placeholder={placeholder}
						className='border-none w-full rounded-[4px] focus:outline-none'
					/>
					<span className='cursor-pointer' onClick={handleShowPassword}>
						{showPassWord ? <IoEyeOutline /> : <IoEyeOffOutline />}
					</span>
				</div>
			) : (
				<input
					id={id}
					type={type}
					value={value}
					onInput={onChange}
					onChange={onChange}
					placeholder={placeholder}
					className='border-foreground/30 border px-4 py-2 w-full rounded-[4px] focus:outline-none'
				/>
			)}
		</div>
	);
};

export default Input;
