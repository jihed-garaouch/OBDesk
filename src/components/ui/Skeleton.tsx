const Skeleton = () => {
	return (
		<div className='flex flex-col items-center justify-center gap-2 animate-pulse w-full'>
			<div className='h-7 w-full min-w-[200px] bg-foreground/15 rounded-md' />
			<div className='h-7 w-full min-w-[200px] bg-foreground/15 rounded-md' />
			<div className='h-7 w-full min-w-[200px] bg-foreground/15 rounded-md' />
		</div>
	);
};

export default Skeleton;
