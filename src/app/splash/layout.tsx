import { SPLASH_METADATA } from '@/lib/metadata';

export const metadata = SPLASH_METADATA;

export default function SplashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
