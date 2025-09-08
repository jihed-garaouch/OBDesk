import Skeleton from "@/components/ui/Skeleton";
import { UseWorldClock } from "@/context/WorldClockContext";
import { FiSun } from "react-icons/fi";
import { IoIosArrowRoundForward } from "react-icons/io";
import { MdOutlineModeNight } from "react-icons/md";
import { Link } from "react-router-dom";

const MiniWorldClock = () => {
	const { currentRegion, timeZones } = UseWorldClock();

	return (
		<div
			className={`flex gap-5 flex-wrap ${
				timeZones.length > 1
					? "flex-row items-center"
					: "flex-row lg:flex-row lg:items-center"
			}`}>
			<div>
				<div>
					<div className='flex items-center gap-2'>
						<p className='font-bold text-xs'>Current City:</p>
						<h1 className='font-bold'>{currentRegion?.city ?? ""}</h1>
					</div>
					<h1 className='font-bold text-base md:text-[1.2rem]'>
						{currentRegion?.date ?? ""}
					</h1>
				</div>
				<div className='flex items-center gap-2'>
					<h1 className='font-black text-[3.2rem] md:text-[4rem] leading-none'>
						{currentRegion?.time ?? ""}
					</h1>
					<span className='text-base md:text-[1.5rem] font-black'>
						{currentRegion?.ampm ?? ""}
					</span>
				</div>
			</div>
			{timeZones.slice(1, 3).map((zone, index) => (
				<div
					key={index}
					className={`p-4 pt-6 border border-foreground/20 border-foreground-20 rounded-lg flex flex-col gap-5 cursor-default relative w-full md:w-fit ${
						zone.active
							? "bg-foreground text-background font-bold"
							: "font-medium"
					}`}>
					<div className='flex justify-between items-center gap-5 text-xs md:text-sm'>
						<h3 className='break-all'>{zone.city}</h3>
						<p>{zone.timezone}</p>
					</div>
					{zone.time ? (
						<>
							<div className='flex justify-center items-end gap-1 font-bold'>
								<h3 className='text-[2.5rem] md:text-[3rem] leading-none'>
									{zone.time}
								</h3>
								<span className='text-sm md:text-lg mb-1'>{zone.ampm}</span>
							</div>
							<div className='flex justify-between items-center gap-3 text-xs md:text-sm'>
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
						</>
					) : (
						<Skeleton />
					)}
				</div>
			))}
			<div>
				<Link
					to='/dashboard/world-clock'
					className='flex items-center justify-center gap-2 text-xs md:text-sm font-medium cursor-pointer bg-black text-white border-foreground border py-2 md:py-3 px-4 md:px-6 rounded-full w-fit h-fit active:scale-95 transition-all duration-500 ease-in-out'>
					<span>See more</span>
					<IoIosArrowRoundForward className='text-xl' />
				</Link>
			</div>
		</div>
	);
};

export default MiniWorldClock;
