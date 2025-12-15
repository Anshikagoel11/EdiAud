import { useEffect, useRef } from "react";

/**
 * Tracks how often each segment of audio is played
 * @param audioRef - ref of <audio> element
 * @param setPlayStats - state setter to store segment counts
 * @param segmentSize - length of each segment in seconds
 */

export default function usePlaybackTracker(
  audioRef,
  setPlayStats,
  segmentSize = 5 // 5 second segments
) {
  const lastSegmentRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const trackPlayback = () => {
      if (audio.paused || audio.ended) return;

      const currentTime = audio.currentTime;
      const segmentIndex = Math.floor(currentTime / segmentSize);

      // prevent multiple counts in same segment continuously
      if (lastSegmentRef.current !== segmentIndex) {
        setPlayStats((prev) => ({
          ...prev,
          [segmentIndex]: (prev[segmentIndex] || 0) + 1,
        }));

        lastSegmentRef.current = segmentIndex;
      }
    };

    // track every 500ms
    const interval = setInterval(trackPlayback, 500);

    return () => clearInterval(interval);
  }, [audioRef, setPlayStats, segmentSize]);
}
