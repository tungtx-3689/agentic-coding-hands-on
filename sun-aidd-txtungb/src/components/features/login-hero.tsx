"use client";

import { signInAsDemo } from "@/lib/auth/actions";
import { KeyVisualSection } from "@/components/layout/keyvisual-section";
import { AuthHeader } from "@/components/layout/auth-header";
import { AuthFooter } from "@/components/layout/auth-footer";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908C16.658 12.075 17.64 9.767 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export function LoginHero() {
  return (
    <KeyVisualSection fullScreen>
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 50%, #ffea9e 0%, transparent 50%), radial-gradient(circle at 50% 20%, #998c5f 0%, transparent 40%)",
        }}
      />

      <AuthHeader />

      <main className="relative z-10 flex-1 flex flex-col items-start justify-center px-10 md:px-20">
        <img src="/aidd-logo-rootfurther.png" alt="Root Further" className="h-16 md:h-24 w-auto mb-8" />
        <p className="text-white text-lg opacity-80 mb-1">
          Bắt đầu hành trình của bạn cùng SAA 2025.
        </p>
        <p className="text-white text-lg opacity-80 mb-10">
          Đăng nhập để khám phá!
        </p>

        <form action={signInAsDemo}>
          <button
            type="submit"
            className="flex items-center gap-3 bg-white text-[#00101a] font-semibold px-8 py-3 rounded-md shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <GoogleIcon />
            <span>LOGIN With Google</span>
          </button>
        </form>
      </main>

      <AuthFooter />
    </KeyVisualSection>
  );
}
