import { IoClose } from "react-icons/io5";

interface DeleteCityModalProps {
	isOpen: boolean;
	onClose: () => void;
	onDeleteCity: (city: string) => void;
	cityToBeDeleted: string;
}

const DeleteCityModal = ({
	isOpen,
	onClose,
	onDeleteCity,
	cityToBeDeleted,
}: DeleteCityModalProps) => {
	if (!isOpen) return null;

	return (
		<div
			onClick={() => {
				onClose();
			}}
			className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4'>
			<div
				onClick={(e) => e.stopPropagation()}
				className='bg-background text-foreground rounded-2xl p-6 w-full max-w-xs md:max-w-sm shadow-lg border border-foreground/20 relative'>
				<button
					onClick={() => {
						onClose();
					}}
					className='absolute top-4 right-4 text-xl text-foreground/80 hover:text-foreground transition-colors cursor-pointer'>
					<IoClose />
				</button>

				<h2 className='text-lg font-bold'>Delete City</h2>
				<p className='text-sm mb-4'>
					Are you sure you want to delete this city?
				</p>
				<div className='flex justify-center gap-5'>
					<button
						onClick={() => {
							onDeleteCity(cityToBeDeleted);
							onClose();
						}}
						className='flex justify-center items-center bg-foreground text-background px-5 py-2 rounded-[6px] cursor-pointer font-bold active:scale-95 transition-all duration-500 ease-in-out'>
						Yes, Delete
					</button>
					<button
						onClick={onClose}
						className='flex justify-center items-center bg-destructive px-5 py-2 rounded-[6px] cursor-pointer font-bold active:scale-95 transition-all duration-500 ease-in-out'>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteCityModal;
