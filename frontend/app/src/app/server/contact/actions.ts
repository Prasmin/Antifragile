"use server";

export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
};

export type ContactActionResult =
  | { success: true }
  | { success: false; error: string };

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw new Error("TURNSTILE_SECRET_KEY is not configured");
  }

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    },
  );

  if (!res.ok) {
    return false;
  }

  const data = (await res.json()) as { success: boolean };
  return data.success;
}

export async function submitContactForm(
  formData: ContactFormData,
): Promise<ContactActionResult> {
  const { name, email, subject, message, turnstileToken } = formData;

  // Verify Turnstile challenge
  const isHuman = await verifyTurnstile(turnstileToken);
  if (!isHuman) {
    return {
      success: false,
      error: "Human verification failed. Please try again.",
    };
  }

  // Basic server-side validation
  if (!name.trim() || name.length > 100) {
    return { success: false, error: "Invalid name." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Invalid email address." };
  }
  if (!subject.trim() || subject.length > 200) {
    return { success: false, error: "Invalid subject." };
  }
  if (message.trim().length < 10 || message.length > 5000) {
    return {
      success: false,
      error: "Message must be between 10 and 5000 characters.",
    };
  }


  return { success: true };
}
