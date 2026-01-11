/**
 * Chapter Indicator Component
 * Displays current chapter with title
 */

interface ChapterIndicatorProps {
  chapter: number;
}

const chapterTitles: Record<number, string> = {
  1: 'Chapter 1: The Awakening',
  2: 'Chapter 2: The Journey',
  3: 'Chapter 3: The Guardian',
  4: 'Epilogue',
};

export function ChapterIndicator({ chapter }: ChapterIndicatorProps) {
  const title = chapterTitles[chapter] || `Chapter ${chapter}`;

  return (
    <div
      style={{
        padding: '0.35rem 0.75rem',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '999px',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#e7f4f1',
        display: 'inline-block',
        letterSpacing: '0.02em',
      }}
    >
      {title}
    </div>
  );
}
