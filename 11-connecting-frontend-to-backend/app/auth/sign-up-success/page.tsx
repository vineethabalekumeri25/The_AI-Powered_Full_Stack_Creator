import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-amber-50 to-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Welcome!</h1>
          <p className="text-slate-600 mb-6">
            Check your email to confirm your account. Once confirmed, you can start documenting your style journey.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-colors font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  )
}
