"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Home as HomeIcon,
  UserPlus,
  ArrowRight,
} from "lucide-react";

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("Agree to terms to proceed.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Member account created for ${fullName}!`);
    }, 800);
  };

  const handleGoogleSignUp = () => {
    alert("Google Sign-Up initialized!");
  };

  const inputClass =
    "w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700  text-zinc-900 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-400 focus:outline-none focus:border-amber-500 font-medium";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-lg p-6 space-y-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 font-bold text-xl text-amber-500">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={120}
              className="rounded-lg object-cover"
              priority
            />
            <span>11 Star House</span>
          </Link>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-200">
            Member Registration
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            Register to join 11 Star House as a member.
          </p>
        </div>

        {error && (
          <div className="p-2.5 text-xs rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        {/* Google Sign Up Button */}
        <Button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full bg-white  text-zinc-900 dark:text-zinc-500 border border-zinc-300 dark:border-zinc-700 font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm transition cursor-pointer">
          <GoogleIcon />
          <span>Sign up with Google</span>
        </Button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
          <span className="absolute bg-white dark:bg-zinc-900 px-3 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            OR
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="font-semibold text-zinc-900 dark:text-zinc-100">
              Full Name *
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3 w-4 h-4 text-zinc-400 dark:text-zinc-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-900 dark:text-zinc-100">
                Email Address *
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-zinc-400 dark:text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-900 dark:text-zinc-100">
                Phone Number *
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3 w-4 h-4 text-zinc-400 dark:text-zinc-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1700 000000"
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Room Number */}
          <div className="space-y-1">
            <label className="font-semibold text-zinc-900 dark:text-zinc-100">
              Room / Seat No. (Optional)
            </label>
            <div className="relative flex items-center">
              <HomeIcon className="absolute left-3 w-4 h-4 text-zinc-400 dark:text-zinc-400" />
              <input
                type="text"
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
                placeholder="Room 302 - Bed A"
                className={inputClass}
              />
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-900 dark:text-zinc-100">
                Password *
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-zinc-400 dark:text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`${inputClass} pr-9`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-zinc-400 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-900 dark:text-zinc-100">
                Confirm Password *
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-zinc-400 dark:text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Agreement */}
          <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300 font-medium">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-zinc-300 text-amber-500"
            />
            <span>I agree to Terms & Privacy Policy</span>
          </label>

          {/* Submit Button */}
          <Button
            type="submit"
            isDisabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm mt-2">
            <UserPlus className="w-4 h-4" />
            <span>Create Member Account</span>
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-0.5">
            Sign in <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
