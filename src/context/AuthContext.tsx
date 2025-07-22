import { supabase } from "@/utils/supabase/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

type Credentials = {
	email: string;
	password: string;
	metadata?: {
		first_name?: string;
		last_name?: string;
	};
};

type AuthResult<T = unknown> =
	| { success: true; data: T }
	| { success: false; error: string | unknown };

interface AuthContextType {
	signUpWithEmail: (creds: Credentials) => Promise<AuthResult>;
	signInWithEmail: (creds: Credentials) => Promise<AuthResult>;
	signInWithGoogle: () => Promise<AuthResult>;
	signInWithGitHub: () => Promise<AuthResult>;
	signOut: () => Promise<void>;
	session: Session | null;
	isLoadingSession: boolean;
	user: { [key: string]: string | boolean } | undefined;
}

const credentialsSchema = z.object({
	email: z.email("Please provide a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [session, setSession] = useState<Session | null>(null);
	const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);
	const [user, setUser] = useState<{ [key: string]: string | boolean }>();

	const signUpWithEmail = async ({
		email,
		password,
		metadata,
	}: Credentials): Promise<AuthResult> => {
		const parsed = credentialsSchema.safeParse({ email, password });
		if (!parsed.success) {
			return {
				success: false,
				error: parsed.error.issues[0]?.message ?? "Invalid input",
			};
		}

		const { data, error } = await supabase.auth.signUp({
			email: email.toLowerCase(),
			password,
			options: {
				data: {
					first_name: metadata?.first_name,
					last_name: metadata?.last_name,
					full_name: `${metadata?.first_name} ${metadata?.last_name}`.trim(),
				},
			},
		});

		if (error) {
			console.error("Error signing up: ", error);
			return { success: false, error: error.message ?? String(error) };
		}

		localStorage.setItem("provider", "email");
		toast.success("Sign-up successful.");
		return { success: true, data };
	};

	const signInWithGoogle = async (): Promise<AuthResult> => {
		const redirectTo = `${window.location.origin}/auth/v1/callback`; // ensure this matches Supabase settings
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo, queryParams: { prompt: "select_account" } },
		});

		if (error) {
			console.error("Error signing up with Google: ", error);
			return { success: false, error: error.message ?? String(error) };
		}

		localStorage.setItem("provider", "google");
		return { success: true, data };
	};

	const signInWithGitHub = async (): Promise<AuthResult> => {
		const redirectTo = `${window.location.origin}/auth/v1/callback`;
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo,
				queryParams: { prompt: "select_account" },
			},
		});

		if (error) {
			console.error("Error signing up with Google: ", error);
			return { success: false, error: error.message ?? String(error) };
		}

		localStorage.setItem("provider", "github");
		return { success: true, data };
	};

	const signInWithEmail = async ({
		email,
		password,
	}: Credentials): Promise<AuthResult> => {
		const parsed = credentialsSchema.safeParse({ email, password });
		if (!parsed.success) {
			return {
				success: false,
				error: parsed.error.issues[0]?.message ?? "Invalid input",
			};
		}

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email.toLowerCase(),
				password,
			});

			if (error) {
				console.error("Sign-in error:", error);
				return { success: false, error: error.message ?? String(error) };
			}

			localStorage.setItem("provider", "email");
			toast.success("Signed in successfully");
			return { success: true, data };
		} catch (err: unknown) {
			console.error("Unexpected error during sign-in:", err);
			return {
				success: false,
				error: "An unexpected error occurred. Please try again.",
			};
		}
	};

	// Sign out
	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Error signing out:", error);
			toast.error("Error signing out");
			return;
		}
		localStorage.removeItem("provider");
	};

	useEffect(() => {
		const updateUserFromSession = (session: Session | null) => {
			if (!session?.user) {
				setUser(undefined);
				return;
			}

			const provider = localStorage.getItem("provider");
			const identity = session.user.identities?.find(
				(identity) => identity.provider === provider
			);

			// Fallback: if no provider match, use the first identity
			const userData =
				identity?.identity_data || session.user.identities?.[0]?.identity_data;
			setUser(userData);
		};

		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setIsLoadingSession(false);
			updateUserFromSession(session);
		});

		const { data: subscription } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session);
				setIsLoadingSession(false);
				updateUserFromSession(session);
			}
		);

		return () => {
			subscription?.subscription?.unsubscribe?.();
		};
	}, []);

	const values: AuthContextType = {
		signUpWithEmail,
		signInWithEmail,
		session,
		signOut,
		signInWithGoogle,
		signInWithGitHub,
		isLoadingSession,
		user,
	};

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const UserAuth = (): AuthContextType => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("UserAuth must be used within AuthContextProvider");
	return ctx;
};
