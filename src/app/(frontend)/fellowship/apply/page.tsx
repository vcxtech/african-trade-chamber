import Link from 'next/link'
import { FellowshipApplicationForm } from '@/components/fellowship/FellowshipApplicationForm'

export const metadata = {
  title: 'Fellowship Application',
  description: 'Apply for the 2026 Future Trade Leaders Fellowship Program.',
}

export default function FellowshipApplyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <Link href="/fellowship" className="text-sm font-semibold text-atc-navy hover:underline">
        ← Future Trade Leaders Fellowship
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-atc-navy">2026 Fellowship Application</h1>
      <p className="mt-4 text-atc-navy/80">
        Complete the form below to apply for the 2026 Future Trade Leaders Fellowship Program.
      </p>
      <div className="mt-8">
        <FellowshipApplicationForm />
      </div>
    </div>
  )
}
