import Image from "next/image";
import nextGPTIcon from "@/assets/nextgpt-icon.svg";

import { SignInButton } from "./sign-in-button";

const LoginForm = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-8">
          <Image
            src={nextGPTIcon}
            alt="NextGPT"
            className="size-12"
            width={48}
            height={48}
          />

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">next.gpt</h1>
            <p className="text-sm text-neutral-400">
              An enhanced GPT interface for developers.
            </p>
          </div>
        </div>
        <SignInButton />
        <p className="px-8 text-center text-sm leading-relaxed text-neutral-400">
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
            target="_blank"
            rel="noreferrer"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
