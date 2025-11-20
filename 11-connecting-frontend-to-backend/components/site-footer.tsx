import Link from "next/link"

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-slate-50 to-slate-100 border-t border-slate-200 mt-20">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-xl">✨</span>
              Style Journal
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Your personal fashion companion for tracking trends, documenting your style journey, and expressing your
              unique fashion sense.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-slate-600 hover:text-amber-700 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/trends" className="text-slate-600 hover:text-amber-700 transition-colors">
                  Trends
                </Link>
              </li>
              <li>
                <Link href="/journal" className="text-slate-600 hover:text-amber-700 transition-colors">
                  Journal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-slate-600 hover:text-amber-700 transition-colors">
                  Style Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-amber-700 transition-colors">
                  Fashion Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-amber-700 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Connect</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-all text-lg"
              >
                📷
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-all text-lg"
              >
                𝕏
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-all text-lg"
              >
                ✉️
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm">&copy; {currentYear} Style Journal. All rights reserved.</p>
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              Made with <span className="text-rose-500">❤️</span> for fashion lovers
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
