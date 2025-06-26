import { UserAuth } from "@/context/AuthContext";

const Avatar = () => {
	const { session } = UserAuth();

	const user = session?.user?.identities?.[0]?.identity_data;
	const fullName = user?.full_name;

	return (
		<div className='bg-foreground rounded-full h-8 w-8 shadow-sm flex items-center justify-center font-bold text-sm text-background overflow-hidden cursor-default'>
			{user?.avatar_url || user?.picture ? (
				<img
					src={user?.avatar_url || user?.picture || ""}
					alt='Profile'
					className='object-cover w-full h-full'
				/>
			) : (
				<span>
					{fullName.split(" ")[0].charAt(0) + fullName.split(" ")[1].charAt(0)}
				</span>
			)}
		</div>
	);
};

export default Avatar;
