import { AuthGuard } from '@/components/AuthGuard'
import { Navbar } from '@/components/Navbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </div>
    </AuthGuard>
  )
}
