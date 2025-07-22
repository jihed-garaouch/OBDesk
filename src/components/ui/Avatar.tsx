import { UserAuth } from "@/context/AuthContext";

const Avatar = () => {
	const { user } = UserAuth();

	const fullName = user?.full_name;
	const avatarUrl = user?.avatar_url;
	const picture = user?.picture;
	const imageUrl =
		(typeof avatarUrl === "string" && avatarUrl) ||
		(typeof picture === "string" && picture) ||
		"";

	return (
		<div className='bg-foreground rounded-full h-8 w-8 shadow-sm flex items-center justify-center font-bold text-sm text-background overflow-hidden cursor-default'>
			{avatarUrl || picture ? (
				<img
					src={imageUrl}
					alt='Profile'
					className='object-cover w-full h-full'
					referrerPolicy='no-referrer'
					crossOrigin='anonymous'
					onError={() => {
						console.error("Image failed to load");
					}}
				/>
			) : (
				<span>
					{typeof fullName === "string"
						? fullName.split(" ")[0].charAt(0) +
						  fullName.split(" ")[1].charAt(0)
						: ""}
				</span>
			)}
		</div>
	);
};

export default Avatar;
