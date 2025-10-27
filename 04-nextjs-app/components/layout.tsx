import type React from "react"
import Navbar from "./navbar"
import Footer from "./footer"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at the top */}
      <Navbar />

      {/* Main content grows to fill available space */}
      <main className="flex-grow">{children}</main>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  )
}
