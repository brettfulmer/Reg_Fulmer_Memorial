import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to Reg's memorial by default
  redirect('/m/reg-fulmer')
}
