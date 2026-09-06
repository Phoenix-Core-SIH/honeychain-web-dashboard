import Link from 'next/link';
import { Hexagon, ShieldCheck, Plant, Storefront, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-20 lg:py-32 flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary-hover mb-8 border border-primary/20 shadow-sm">
            <Hexagon weight="fill" className="w-5 h-5" />
            <span className="font-semibold text-sm uppercase tracking-wider">KVIC Honey Mission</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
            Pure Honey, <br className="hidden md:block" /> Traceable from Hive to Home
          </h1>
          <p className="text-lg md:text-xl text-muted-fg max-w-2xl mb-10 leading-relaxed">
            Every jar of our honey has a story. Scan the QR code on your jar to verify its authenticity, meet the beekeeper, and see the exact journey it took to reach you.
          </p>
          <Link
            href="/verify"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-fg font-medium text-lg rounded-xl overflow-hidden transition-transform hover:scale-105 shadow-xl shadow-primary/20"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            <MagnifyingGlass weight="bold" className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Verify Your Honey Jar</span>
          </Link>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">How HoneyChain Works</h2>
          <p className="text-muted-fg max-w-2xl mx-auto">We use blockchain technology to ensure complete transparency in the supply chain, protecting both consumer health and farmer livelihoods.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-card-border z-0" />
          
          <div className="relative z-10 bg-card-bg border border-card-border rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
              <Plant weight="fill" className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">1. Harvested</h3>
            <p className="text-muted-fg">Beekeepers log their raw harvest directly at the apiary, capturing location and yield data securely.</p>
          </div>

          <div className="relative z-10 bg-card-bg border border-card-border rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6 border border-secondary/20">
              <ShieldCheck weight="fill" className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">2. Processed & Tested</h3>
            <p className="text-muted-fg">Certified facilities filter and test the honey for purity, logging lab results on the immutable ledger.</p>
          </div>

          <div className="relative z-10 bg-card-bg border border-card-border rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20">
              <Storefront weight="fill" className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">3. Delivered to You</h3>
            <p className="text-muted-fg">The packaged jar receives a unique QR code. You scan it to view the entire verified history.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full mt-auto border-t border-card-border bg-card-bg py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-fg">
          <div className="flex items-center gap-2">
            <Hexagon weight="fill" className="w-5 h-5 text-primary" />
            <span>© {new Date().getFullYear()} HoneyChain Traceability System</span>
          </div>
          <p>An initiative of the Khadi and Village Industries Commission (KVIC)</p>
        </div>
      </footer>
    </div>
  );
}
