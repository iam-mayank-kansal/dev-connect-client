'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight } from 'lucide-react';

export default function UnauthenticatedView() {
  return (
    <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* --- BACKGROUND DESIGN ELEMENTS --- */}
      <div className="absolute inset-0 z-0">
        {/* Subtle Grid - Matches dashboard card border weight */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Soft Accents - Opacity reduced for professional look */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <main className="relative z-10 max-w-4xl px-6 text-center">
        {/* Floating Badge - Smaller font for "convenience" */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
          <Sparkles size={14} className="animate-pulse" />
          <span>The next-gen dev ecosystem</span>
        </div>

        {/* Hero Text - Scaled down for better readability/hierarchy */}
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.1]">
          Code. Connect. <br />
          <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Build Together.
          </span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          DevConnect is where the world’s best engineers share ideas, build
          high-scale projects, and find their next big opportunity.
        </p>

        {/* Primary CTA & Terminal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/login"
            className="group flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-base transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
          >
            Join the Community
            <ChevronRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Footer Link - Subtle and clean */}
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-foreground font-semibold hover:text-primary transition-colors underline decoration-border underline-offset-4 hover:decoration-primary"
          >
            Create one for free
          </Link>
        </p>
      </main>
    </div>
  );
}
