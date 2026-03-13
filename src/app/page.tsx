export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/prompts/prompt-card";
import { Footer } from "@/components/layout/footer";
import { getRecentPrompts } from "@/lib/data/queries";
import { ArrowRight, Sparkles, Share2, Layers } from "lucide-react";
import { MAX_WIDTH } from "@/lib/constants";
import { cn } from "@/lib/cn";

export default async function LandingPage() {
  const recentPrompts = await getRecentPrompts(6);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="border-b border-border">
        <div className={cn("mx-auto flex h-14 items-center justify-between px-4", MAX_WIDTH)}>
          <Link href="/" className="text-lg font-semibold tracking-tight">
            prmpts
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/explore">
              <Button variant="ghost" size="sm">Explore</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">Sign in</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className={cn("mx-auto px-4 py-24 text-center", MAX_WIDTH)}>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Craft, share, and discover
          <br />
          <span className="text-accent">AI prompts</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-muted">
          Build reusable prompts and multi-step workflows. Share with the
          community or keep them private.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/explore">
            <Button size="lg">
              Explore prompts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" size="lg">
              Get started
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured */}
      {recentPrompts.length > 0 && (
        <section className={cn("mx-auto px-4 pb-16", MAX_WIDTH)}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent prompts</h2>
            <Link href="/explore" className="text-sm text-muted hover:text-foreground">
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="border-t border-border bg-surface">
        <div className={cn("mx-auto px-4 py-16", MAX_WIDTH)}>
          <h2 className="mb-10 text-center text-xl font-semibold">How it works</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: "Create",
                description:
                  "Write prompts with variable placeholders or build multi-step workflows.",
              },
              {
                icon: <Share2 className="h-6 w-6" />,
                title: "Share",
                description:
                  "Publish to the community or share a direct link with your team.",
              },
              {
                icon: <Layers className="h-6 w-6" />,
                title: "Remix",
                description:
                  "Discover prompts from others, save favorites, and remix to make them your own.",
              },
            ].map((step) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-background text-accent">
                  {step.icon}
                </div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={cn("mx-auto px-4 py-16 text-center", MAX_WIDTH)}>
        <h2 className="text-2xl font-bold">Ready to start?</h2>
        <p className="mt-2 text-muted">Join the community and share your best prompts.</p>
        <Link href="/signup">
          <Button size="lg" className="mt-6">
            Create your account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
