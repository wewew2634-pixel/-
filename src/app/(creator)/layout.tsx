import type { Metadata } from 'next';
import { CREATOR_HOME_METADATA } from '@/lib/metadata';

export const metadata: Metadata = CREATOR_HOME_METADATA;

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
