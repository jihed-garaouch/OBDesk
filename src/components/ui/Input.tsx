import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

interface InputProps {
	type: string;
	label: string;
	id: string;
	placeholder: string;
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
	const [showPassWord, setShowPassWord] = useState(false);

	const handleShowPassword = () => {
		setShowPassWord(!showPassWord);
	};

	return (
		<div className='flex flex-col gap-1 text-sm text-foreground'>
			<label htmlFor={id} className='font-bold'>
				{label}
			</label>
			{type === "password" ? (
				<div className='border-foreground border px-4 py-2 w-full rounded-[4px] flex items-center gap-3'>
					<input
						id={id}
						required
						type={showPassWord ? "text" : "password"}
						value={value}
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
					required
					type={type}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					className='border-foreground border px-4 py-2 w-full rounded-[4px] focus:outline-none'
				/>
			)}
		</div>
	);
};

export default Input;
