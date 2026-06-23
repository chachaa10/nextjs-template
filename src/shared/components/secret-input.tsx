"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, useState } from "react";

import { cn } from "@/lib/utils.ts";
import { Input } from "@/shared/components/ui/input.tsx";

const SecretInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={show ? "text" : "password"}
          className={cn("pr-7", className)}
          {...props}
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShow((v) => !v)}
          className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={show ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {show ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
        </button>
      </div>
    );
  },
);
SecretInput.displayName = "SecretInput";

export { SecretInput };
