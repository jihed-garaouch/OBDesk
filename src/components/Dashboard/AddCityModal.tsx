import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import ClockSkeleton from "../ui/ClockSkeleton";
import { fetchTimezones } from "@/api/endpoints/timezones";

interface AddCityModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAddCity: (city: string) => void;
}

export const AddCityModal = ({
	isOpen,
	onClose,
	onAddCity,
}: AddCityModalProps) => {
	const [search, setSearch] = useState("");
	const [timezones, setTimezones] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchAllTimezones = async () => {
			setLoading(true);
			try {
				const data = await fetchTimezones();
				setTimezones(data);
			} catch (error) {
				console.error("Error fetching timezones", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAllTimezones();
	}, []);

	const filtered = timezones.filter((tz) =>
		tz.toLowerCase().includes(search.toLowerCase())
	);

	if (!isOpen) return null;

	return (
		<div
			onClick={() => {
				onClose();
				setSearch("");
			}}
			className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4'>
			<div
				onClick={(e) => e.stopPropagation()}
				className='bg-background text-foreground rounded-2xl p-6 w-full max-w-md shadow-lg border border-foreground/20 relative'>
				<button
					onClick={() => {
						onClose();
						setSearch("");
					}}
					className='absolute top-4 right-4 text-xl text-foreground/80 hover:text-foreground transition-colors cursor-pointer'>
					<IoClose />
				</button>

				<h2 className='text-lg font-bold mb-4'>Add New City</h2>

				<input
					type='text'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder='Search timezone (e.g., Europe/London)'
					className='w-full border border-foreground/30 rounded-xl p-3 text-sm focus:outline-none focus:border-foreground transition-all mb-4'
				/>

				<div className='max-h-60 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-foreground/30'>
					{loading ? (
						<ClockSkeleton />
					) : filtered.length ? (
						filtered.map((timezone, index) => (
							<div
								key={index}
								onClick={() => {
									onAddCity(timezone);
									onClose();
									setSearch("");
								}}
								className='cursor-pointer border border-foreground/20 rounded-lg p-3 hover:bg-foreground hover:text-background transition-all duration-300 ease-in-out'>
								{timezone}
							</div>
						))
					) : (
						<p className='text-sm text-center text-foreground/60'>
							No results found.
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
