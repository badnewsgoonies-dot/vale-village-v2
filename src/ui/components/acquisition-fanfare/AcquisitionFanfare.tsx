import { forwardRef } from 'preact/compat';
import { useEffect, useRef, useState, useImperativeHandle } from 'preact/hooks';

export type AcquisitionFanfareHandle = {
  play: (name?: string) => void;
  stop: () => void;
};

export type Props = {
  itemName?: string;
  durationMs?: number;
  onFinish?: () => void;
};

const DEFAULT_DURATION = 1500;

const AcquisitionFanfare = forwardRef<AcquisitionFanfareHandle, Props>(
  ({ itemName = '', durationMs = DEFAULT_DURATION, onFinish }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [name, setName] = useState(itemName);
    const timerRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      play: (n?: string) => {
        if (n) setName(n);
        setIsPlaying(false);
        // ensure DOM updates and restart animation
        window.requestAnimationFrame(() => {
          setIsPlaying(true);
          if (timerRef.current) window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
            setIsPlaying(false);
            onFinish?.();
            timerRef.current = null;
          }, durationMs);
        });
      },
      stop: () => {
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setIsPlaying(false);
      },
    }));

    useEffect(() => {
      return () => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
      };
    }, []);

    if (!isPlaying) return null;

    return (
      <div className="acq-fanfare" role="status" aria-live="polite">
        <div className="fanfare-card">
          <div className="fanfare-sparkles" aria-hidden />
          <div className="fanfare-content">
            <div className="fanfare-title">Item Acquired!</div>
            <div className="fanfare-name">{name}</div>
          </div>
        </div>
      </div>
    );
  }
);

AcquisitionFanfare.displayName = 'AcquisitionFanfare';

export default AcquisitionFanfare;
