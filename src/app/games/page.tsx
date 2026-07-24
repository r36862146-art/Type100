import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { 
  Rocket, 
  Car, 
  Blocks, 
  Castle,
  Play,
  Clock,
  Swords,
  Lock
} from "lucide-react";
import { constructMetadata } from "@/lib/seo"

export const metadata = constructMetadata({
  title: "Typing Games - Improve Speed with Fun",
  description: "Play SpaceType, TypeRace, and WordTetris to improve your typing speed and accuracy through fun interactive games.",
  canonical: "/games",
});
import { cn } from "@/lib/utils";

import { GAMES_CONFIG } from "@/config/games";

export default function GamesHubPage() {
  return (
    <div className="min-h-screen pb-24">
      <div className="bg-muted/30 py-16 md:py-24 border-b border-border">
        <Container>
          <FadeIn className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
              New Feature
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              <span className="text-primary mr-3">🎮</span>
              Typing Games
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Learn faster by playing interactive typing games. Improve your raw speed, accuracy, and keyboard mastery without it feeling like practice.
            </p>
          </FadeIn>
        </Container>
      </div>

      <Container className="pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {GAMES_CONFIG.filter(g => g.enabled).map((game, i) => (
            <FadeIn key={game.id} delay={i * 0.1} direction="up">
              <div 
                className={cn(
                  "relative h-full flex flex-col rounded-2xl border bg-card p-6 md:p-8 transition-all duration-500 overflow-hidden group hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 cursor-pointer"
                )}
              >
                {/* Background Gradient */}
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500", game.color, "group-hover:opacity-100")} />
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("p-4 rounded-xl bg-background border shadow-sm", game.iconColor)}>
                      <game.icon className="w-8 h-8" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{game.title}</h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed flex-1">
                    {game.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                      <Swords className="w-4 h-4" />
                      {game.difficulty}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                      <Clock className="w-4 h-4" />
                      {game.playTime}
                    </div>
                  </div>

                  <Link 
                    href={`/games/${game.id}`}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl transition-transform active:scale-95"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Play Now
                  </Link>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </div>
  );
}
