const ClockSkeleton = () => {
	return (
		<div className='flex flex-col items-center justify-center gap-2 animate-pulse'>
			<div className='h-7 w-full bg-foreground/15 rounded-md' />
			<div className='h-7 w-full bg-foreground/15 rounded-md' />
			<div className='h-7 w-full bg-foreground/15 rounded-md' />
		</div>
	);
};

export default ClockSkeleton;
