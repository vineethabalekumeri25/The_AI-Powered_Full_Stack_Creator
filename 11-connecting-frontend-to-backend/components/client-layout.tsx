"use client"

import Link from "next/link"
import { useState } from "react"

function SiteNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/trends", label: "Trends" },
    { href: "/journal", label: "Journal" },
  ]

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all text-lg">
            ✨
          </div>
          <span className="text-xl font-bold text-slate-900 hidden sm:inline">Style Journal</span>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-700 hover:text-amber-700 font-medium transition-colors relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-700 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 cursor-pointer text-xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-50 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
          <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-700 hover:text-amber-700 font-medium transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

function SiteFooter() {
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

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteNavbar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
