"use server";

import { redirect } from "next/navigation";
import { SIGNED_IN_RESULT } from "@/lib/auth-result";
import { createClient } from "@/lib/supabase/server";

export async function signIn(
  _previousState: string | null,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address.";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (cause) {
    return cause instanceof Error
      ? cause.message
      : "Supabase is not configured. Add keys to .env.local.";
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message === "Invalid login credentials") {
      return "Email or password is wrong. Add this user in Supabase: Auth → Users → Add user (turn on Auto Confirm User).";
    }

    if (error.message.toLowerCase().includes("email not confirmed")) {
      return "This email is not confirmed. In Auth → Users, open the user and confirm the email.";
    }

    return error.message;
  }

  return SIGNED_IN_RESULT;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
