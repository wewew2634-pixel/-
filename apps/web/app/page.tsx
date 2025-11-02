import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to creator app (main B2C experience)
  redirect('/creator/home')
}