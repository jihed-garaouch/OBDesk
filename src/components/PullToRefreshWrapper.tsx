import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundDown } from "react-icons/io";
import { MdOutlineRefresh } from "react-icons/md";

interface PullToRefreshProps {
	children: React.ReactNode;
	onRefresh: () => Promise<void>;
	threshold?: number;
	maxPull?: number;
	disabled?: boolean;
}

const PullToRefreshWrapper: React.FC<PullToRefreshProps> = ({
	children,
	onRefresh,
	threshold = 40,
	maxPull = 60,
	disabled = false,
}) => {
	const [pullDistance, setPullDistance] = useState(0);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [canPull, setCanPull] = useState(false);

	const startY = useRef(0);
	const containerRef = useRef<HTMLDivElement>(null);

	// Disable native browser pull-to-refresh when custom version is active
	useEffect(() => {
		if (disabled) return;

		document.body.style.overscrollBehavior = "none";
		document.documentElement.style.overscrollBehavior = "none";

		return () => {
			document.body.style.overscrollBehavior = "";
			document.documentElement.style.overscrollBehavior = "";
		};
	}, [canPull, disabled]);

	const handleTouchStart = (e: React.TouchEvent) => {
		if (disabled || isRefreshing) return;

		const container = containerRef.current;
		if (container && container.scrollTop <= 0) {
			startY.current = e.touches[0].clientY;
			setCanPull(true);
		}
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!canPull || isRefreshing || disabled) return;

		const container = containerRef.current;
		if (!container) return;

		const currentY = e.touches[0].clientY;
		const distance = currentY - startY.current;

		if (distance > 0 && container.scrollTop <= 0) {
			const resistance = 0.5;
			const adjustedDistance = Math.min(distance * resistance, maxPull);
			setPullDistance(adjustedDistance);
		}
	};

	const handleTouchEnd = async () => {
		if (disabled) return;

		if (pullDistance >= threshold && !isRefreshing) {
			setIsRefreshing(true);
			try {
				await onRefresh();
			} catch (error) {
				console.error("Refresh failed:", error);
			} finally {
				setTimeout(() => {
					setIsRefreshing(false);
					setPullDistance(0);
				}, 700);
			}
		} else {
			setPullDistance(0);
		}
		setCanPull(false);
	};

	const opacity = Math.min(pullDistance / threshold, 1);

	return (
		<>
			{!disabled && pullDistance > 0 && (
				<div
					className='fixed top-10 left-0 right-0 text-center text-xs font-medium transition-opacity duration-200 z-50'
					style={{ opacity }}>
					<div className='flex items-center justify-center gap-1'>
						{pullDistance >= threshold ? (
							<MdOutlineRefresh
								className={`w-5 h-5 ${
									isRefreshing
										? "text-foreground animate-spin"
										: pullDistance >= threshold
										? "text-foreground"
										: "text-foreground/50"
								}`}
							/>
						) : (
							<IoIosArrowRoundDown
								className={`w-5 h-5 animate-pulse ${
									pullDistance >= threshold
										? "text-foreground"
										: "text-foreground/50"
								}`}
							/>
						)}
						{isRefreshing ? (
							<span className='text-foreground'>Refreshing...</span>
						) : pullDistance >= threshold ? (
							<span className='text-foreground'>Release to refresh</span>
						) : (
							<span className='text-foreground/50'>Pull down to refresh</span>
						)}
					</div>
				</div>
			)}

			{/* Scrollable content */}
			<div
				ref={containerRef}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}>
				<div
					style={{
						transform: `translateY(${pullDistance}px)`,
						transition:
							isRefreshing || (!canPull && pullDistance === 0)
								? "transform 0.3s ease"
								: "none",
					}}>
					{children}
				</div>
			</div>
		</>
	);
};

export default PullToRefreshWrapper;
