"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-10 border border-border bg-surface rounded-xl shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight mb-8 text-center text-foreground">
          NBA Accreditation Data Automation and Evidence Management System
        </h1>
        <form action={formAction} className="space-y-5">
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter shared password"
              className="w-full px-4 py-2 text-sm border border-border rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors bg-surface-alt text-foreground placeholder:text-muted"
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
            className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 text-sm shadow-sm"
          >
            {pending ? "Authenticating..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
