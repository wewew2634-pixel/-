import { splashMetadata } from './metadata';

export const metadata = splashMetadata;

export default function SplashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
