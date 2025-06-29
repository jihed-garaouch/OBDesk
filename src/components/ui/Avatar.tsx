import { UserAuth } from "@/context/AuthContext";

const Avatar = () => {
	const { user } = UserAuth();

	const fullName = user?.full_name;
	const avatarUrl = user?.avatar_url;
	const picture = user?.picture;

	return (
		<div className='bg-foreground rounded-full h-8 w-8 shadow-sm flex items-center justify-center font-bold text-sm text-background overflow-hidden cursor-default'>
			{user?.avatar_url || user?.picture ? (
				<img
					src={
						(typeof avatarUrl === "string" && avatarUrl) ||
						(typeof picture === "string" && picture) ||
						""
					}
					alt='Profile'
					className='object-cover w-full h-full'
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
