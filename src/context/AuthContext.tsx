import { supabase } from "@/helper/supabaseClient";
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

		return { success: true, data };
	};
	
	const signInWithGitHub = async (): Promise<AuthResult> => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "github",
			options: { 
				// redirectTo,
				 queryParams: { prompt: "select_account" } },
		});

		if (error) {
			console.error("Error signing up with Google: ", error);
			return { success: false, error: error.message ?? String(error) };
		}

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
	};

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setIsLoadingSession(false);
		});

		const { data: subscription } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session);
				setIsLoadingSession(false);
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
	};

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const UserAuth = (): AuthContextType => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("UserAuth must be used within AuthContextProvider");
	return ctx;
};
