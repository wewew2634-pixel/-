import { redirect } from 'next/navigation';

/**
 * Root page - Redirects to splash screen
 * This is the entry point of the application
 */
export default function HomePage() {
  // Redirect to splash screen which will handle onboarding flow
  redirect('/splash');
}
