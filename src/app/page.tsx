import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function Home() {
  // Redirect to Reg's memorial by default
  redirect('/m/reg-fulmer')
}
