import { useEffect, useRef, useState } from "react";

export default function usePlaybackTracker(
  audioRef,
  audioUrl,
  segmentSize = 5
) {
  const [segments, setSegments] = useState([]);
  const lastSegmentRef = useRef(null);

  // 🔹 Initialize segments when audio element is ready
  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;

    const audio = audioRef.current;

    const initSegments = () => {
      const duration = audio.duration;
      if (!duration || isNaN(duration)) return;

      const count = Math.ceil(duration / segmentSize);

      const initial = Array.from({ length: count }, (_, i) => ({
        index: i,
        start: i * segmentSize,
        end: Math.min((i + 1) * segmentSize, duration),
        plays: 0,
      }));

      setSegments(initial);
      lastSegmentRef.current = null;
    };

    audio.addEventListener("loadedmetadata", initSegments);
    initSegments(); // 👈 in case metadata already loaded

    return () => {
      audio.removeEventListener("loadedmetadata", initSegments);
    };
  }, [audioRef, audioUrl, segmentSize]);

  // 🔹 Track playback
  useEffect(() => {
    if (!audioRef.current || segments.length === 0) return;

    const audio = audioRef.current;

    const onTimeUpdate = () => {
      const time = audio.currentTime;
      const index = Math.floor(time / segmentSize);

      if (index !== lastSegmentRef.current) {
        lastSegmentRef.current = index;

        setSegments((prev) =>
          prev.map((s) =>
            s.index === index ? { ...s, plays: s.plays + 1 } : s
          )
        );
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => audio.removeEventListener("timeupdate", onTimeUpdate);
  }, [audioRef, segments.length, segmentSize]);

  return segments;
}
