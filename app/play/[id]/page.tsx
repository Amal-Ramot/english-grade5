import Game from '@/components/Game';
import { LEVELS, type LevelId } from '@/lib/data';

export function generateStaticParams() {
  return LEVELS.map((l) => ({ id: l.id }));
}
export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Game id={id as LevelId} />;
}
