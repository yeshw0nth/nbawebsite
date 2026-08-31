"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900 font-sans">
      <div className="w-full max-w-sm p-8 border border-zinc-200 rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight mb-6 text-center text-zinc-900">
          Dashboard Access
        </h1>
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter shared password"
              className="w-full px-4 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors placeholder:text-zinc-400"
              required
            />
          </div>
          
          {state?.error && (
            <p className="text-sm font-medium text-red-500 tracking-tight text-center">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 text-sm"
          >
            {pending ? "Authenticating..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
