import Link from "next/link";
import Logo from "@/components/Logo";

export default function Splash() {
  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <section className="text-center space-y-6">
        <Logo size="xl" />
        <h1 className="text-3xl font-extrabold tracking-tight">ZZMUK</h1>
        <p className="text-sm text-white/70">로컬 미션 — 오늘 찍고 오늘 정산</p>
        <Link
          href="/onboarding"
          className="inline-flex h-12 px-6 items-center justify-center rounded-2xl bg-primary text-on-primary font-semibold hover:brightness-105 transition"
        >
          시작하기
        </Link>
      </section>
    </main>
  );
}
