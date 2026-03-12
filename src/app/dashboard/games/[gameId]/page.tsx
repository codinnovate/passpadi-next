import type { Metadata } from "next";
import GamePlayer from "@/components/games/GamePlayer";
import { GAMES, type GameId } from "@/components/games/types";

type PageProps = {
  params: Promise<{ gameId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gameId } = await params;
  const game = GAMES.find((g) => g.id === gameId);
  const title = game ? `${game.title} — Games` : "Game";
  const description = game?.description || "Play an interactive quiz game.";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | 90percent`,
      description,
    },
  };
}

export default async function GamePage({ params }: PageProps) {
  const { gameId } = await params;
  return (
    <div className="flex flex-col w-full gap-4 py-6">
      <GamePlayer gameId={gameId as GameId} />
    </div>
  );
}
