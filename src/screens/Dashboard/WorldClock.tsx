import AddCityModal from "@/components/Dashboard/WorldClock/AddCityModal";
import DeleteCityModal from "@/components/Dashboard/WorldClock/DeleteCityModal";
import LoadingScreen from "@/components/Loading/Loading";
import { UseWorldClock } from "@/context/WorldClockContext";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { useState } from "react";
import { FiSun } from "react-icons/fi";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { MdDeleteOutline, MdOutlineModeNight } from "react-icons/md";
import { toast } from "sonner";

export type TimeZone = {
	city: string;
	timezone: string;
	time: string;
	ampm: string;
	timeOfDay: string;
	active: boolean;
	date: string;
};

const WorldClockScreen = () => {
	const { isOnline } = useNetworkStatus();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [cityToBeDeleted, setCityToBeDeleted] = useState("");

	const { currentRegion, timeZones, handleAddCity, handleDeleteCity } =
		UseWorldClock();

	if (timeZones.length === 0) return <LoadingScreen />;

	return (
		<div className='pr-4 h-full'>
			{/* Top Section */}
			<div className='mb-4'>
				<h1 className='font-bold text-sm md:text-[1.5rem] xl:text-[2rem]'>
					{currentRegion?.date ?? ""}
				</h1>

				<div className='flex items-center justify-center gap-2'>
					<h1 className='font-black text-[16vw] md:text-[17vw] leading-none'>
						{currentRegion?.time ?? ""}
					</h1>
					<span className='text-xs md:text-[1.5rem] xl:text-[3rem] font-black'>
						{currentRegion?.ampm ?? ""}
					</span>
				</div>

				<div className='flex flex-col md:flex-row justify-between md:items-center gap-3 mt-2'>
					<div className='flex flex-col'>
						<p className='font-bold text-xs md:text-sm'>Current City.</p>
						<h1 className='font-bold text-[1.5rem] xl:text-[2rem]'>
							{currentRegion?.city ?? ""}
						</h1>
					</div>
					<button
						onClick={() => {
							if (!isOnline) {
								toast.info(
									"Cannot add cities while offline. Come back online!"
								);
								return;
							}
							setIsModalOpen(true);
						}}
						className='flex items-center justify-center gap-2 text-xs md:text-sm font-medium cursor-pointer bg-black text-white border-foreground border p-3 rounded-full w-fit h-fit active:scale-95 transition-all duration-500 ease-in-out md:min-w-[154px]'>
						<span>Add another city</span>
						<HiOutlinePlusCircle className='text-base' />
					</button>
				</div>
			</div>

			{/* Timezone Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
				{timeZones.map((zone, index) => (
					<div
						key={index}
						className={`p-4 pt-6 border border-foreground/50 rounded-lg flex flex-col gap-3 cursor-default relative ${
							zone.active
								? "bg-foreground text-background font-bold"
								: "font-medium"
						}`}>
						{index !== 0 && (
							<div className=' absolute top-3 right-4 flex justify-end text-[1.3rem]'>
								<span
									className='active:scale-90 transition-all duration-500 ease-in-out'
									onClick={() => {
										setIsDeleteModalOpen(true);
										setCityToBeDeleted(zone.timezone);
									}}>
									<MdDeleteOutline className='cursor-pointer text-red-500' />
								</span>
							</div>
						)}
						<div className='flex justify-between items-center gap-5 text-sm min-h-[50px]'>
							<h3 className='break-all'>{zone.city}</h3>
							<p>{zone.timezone}</p>
						</div>

						<div className='flex justify-between items-center gap-3 text-sm'>
							<div className='flex items-end gap-1'>
								<h3 className='text-[3rem] leading-none'>{zone.time}</h3>
								<span className='text-lg font-semibold mb-1'>{zone.ampm}</span>
							</div>
						</div>

						<div className='flex justify-between items-center gap-3 text-sm'>
							<span>{zone.date}</span>
							<span className='flex items-center gap-1'>
								{zone.timeOfDay === "day" ? (
									<>
										<FiSun />
										<span className='capitalize'>{zone.timeOfDay}</span>
									</>
								) : (
									<>
										<MdOutlineModeNight className='rotate-45' />
										<span className='capitalize'>{zone.timeOfDay}</span>
									</>
								)}
							</span>
						</div>
					</div>
				))}
			</div>

			<AddCityModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onAddCity={handleAddCity}
			/>
			<DeleteCityModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onDeleteCity={handleDeleteCity}
				cityToBeDeleted={cityToBeDeleted}
			/>
		</div>
	);
};

export default WorldClockScreen;
