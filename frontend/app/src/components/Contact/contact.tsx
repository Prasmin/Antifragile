"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { TurnstileWidget } from "@/components/Turnstile/Turnstile";
import { submitContactForm } from "@/app/server/contact/actions";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const contactInfo = [
  {
    icon: <MapPin className="size-5" />,
    label: "Location",
    value: "Sydney · Australia",
    href: undefined,
  },
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!turnstileToken) {
      setServerError("Please complete the human verification challenge.");
      return;
    }
    setServerError(null);

    const result = await submitContactForm({ ...data, turnstileToken });

    if (!result.success) {
      setServerError(result.error);
      // Reset the Turnstile widget so the user can retry
      setTurnstileToken(null);
      return;
    }

    setSubmitted(true);
    reset();
    setTurnstileToken(null);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="relative text-white sm:max-w-xl mx-auto px-4 py-20">
      {/* ── decorative glow ── */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[620px] rounded-full bg-indigo-600/15 blur-[120px]" />

      {/* ── heading ── */}
      <div className="relative text-center mb-16">
        <span className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-indigo-400 mb-4">
          Get in Touch
        </span>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Let&rsquo;s Start a{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Conversation
          </span>
        </h2>
        <p className="text-lg text-white/60 max-w-xl mx-auto">
          Have a question, feedback, or just want to say hello? We&rsquo;d love
          to hear from you.
        </p>
      </div>

      <div className="relative grid lg:grid-cols-2 gap-8">
        {/* ── left column — info cards ── */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="group flex items-start gap-4 rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 transition-colors group-hover:bg-indigo-500/20">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-white/50">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-0.5 text-base font-medium text-white transition-colors hover:text-indigo-400"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-0.5 text-base font-medium text-white">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── right column — form ── */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle className="size-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-white/60 max-w-sm">
                  Thanks for reaching out. We&rsquo;ll get back to you within 24
                  hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                {/* ── row: name + email ── */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-sm font-medium text-white/70"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      aria-invalid={!!errors.name}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 aria-[invalid=true]:border-red-500/50 aria-[invalid=true]:ring-red-500/20"
                      {...register("name", {
                        required: "Name is required",
                        maxLength: {
                          value: 100,
                          message: "Name must be under 100 characters",
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-white/70"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 aria-[invalid=true]:border-red-500/50 aria-[invalid=true]:ring-red-500/20"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* ── subject ── */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block text-sm font-medium text-white/70"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="What's this about?"
                    aria-invalid={!!errors.subject}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 aria-[invalid=true]:border-red-500/50 aria-[invalid=true]:ring-red-500/20"
                    {...register("subject", {
                      required: "Subject is required",
                      maxLength: {
                        value: 200,
                        message: "Subject must be under 200 characters",
                      },
                    })}
                  />
                  {errors.subject && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* ── message ── */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium text-white/70"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us more…"
                    aria-invalid={!!errors.message}
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 aria-[invalid=true]:border-red-500/50 aria-[invalid=true]:ring-red-500/20"
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Message must be at least 10 characters",
                      },
                      maxLength: {
                        value: 5000,
                        message: "Message must be under 5000 characters",
                      },
                    })}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* ── Turnstile ── */}
                <div>
                  <TurnstileWidget
                    onSuccess={setTurnstileToken}
                    onExpire={() => setTurnstileToken(null)}
                    onError={() => {
                      setTurnstileToken(null);
                      setServerError(
                        "Verification error. Please refresh and try again.",
                      );
                    }}
                  />
                  {serverError && (
                    <p className="mt-2 text-xs text-red-400">{serverError}</p>
                  )}
                </div>

                {/* ── submit ── */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:opacity-60 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
