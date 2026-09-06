'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { Hexagon, List, X, Moon, Sun, UserCircle } from '@phosphor-icons/react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // Don't show public navbar on admin routes except login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Hexagon 
                weight="fill" 
                className="w-8 h-8 text-primary group-hover:text-primary-hover transition-colors" 
              />
              <span className="font-serif font-bold text-xl tracking-tight text-foreground">
                HoneyChain
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/verify" 
              className="text-sm font-medium text-muted-fg hover:text-primary transition-colors"
            >
              Verify Honey
            </Link>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-fg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun weight="bold" /> : <Moon weight="bold" />}
            </button>

            <Link 
              href="/admin/login" 
              className="flex items-center gap-2 text-sm font-medium text-muted-fg hover:text-foreground transition-colors border-l border-card-border pl-6"
            >
              <UserCircle className="w-5 h-5" />
              <span>Partner Login</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-fg hover:bg-muted transition-colors"
            >
              {theme === 'dark' ? <Sun weight="bold" /> : <Moon weight="bold" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-muted-fg hover:bg-muted transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-card-border bg-background">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/verify"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors"
            >
              Verify Honey
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-muted-fg hover:bg-muted hover:text-foreground transition-colors"
            >
              Partner Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
