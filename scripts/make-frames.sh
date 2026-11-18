#!/usr/bin/env bash
# Turn your character video into web frames for the interactive hero.
#
# Usage:   bash scripts/make-frames.sh path/to/character.mp4
# Needs:   ffmpeg  (Windows: winget install ffmpeg · macOS: brew install ffmpeg)
#
# Output:  client/public/character/frame_0001.webp …  + config.json
# Then open config.json and adjust the segment times (seconds) to match your video.

set -euo pipefail
IN="${1:?Give the path to your video, e.g. bash scripts/make-frames.sh character.mp4}"
OUT="client/public/character"
FPS=15        # frames per second kept from the video (lower = smaller download)
WIDTH=900     # frame width in pixels

mkdir -p "$OUT"
rm -f "$OUT"/frame_*.webp
ffmpeg -v error -i "$IN" -vf "fps=${FPS},scale=${WIDTH}:-2" -c:v libwebp -quality 72 -compression_level 6 "$OUT/frame_%04d.webp"

COUNT=$(ls "$OUT"/frame_*.webp | wc -l | tr -d ' ')
DURATION=$(awk "BEGIN{printf \"%.2f\", $COUNT/$FPS}")

if [ ! -f "$OUT/config.json" ]; then
cat > "$OUT/config.json" <<EOF
{
  "count": $COUNT,
  "fps": $FPS,
  "pattern": "frame_%04d.webp",
  "segments": {
    "idleEnd": 2.0,
    "lookLeft": 2.6,
    "lookRight": 3.6,
    "greetStart": 4.0
  }
}
EOF
else
  # keep your tuned segment times, just update count/fps
  node -e "const f='$OUT/config.json',c=require('./'+f);c.count=$COUNT;c.fps=$FPS;require('fs').writeFileSync(f,JSON.stringify(c,null,2)+'\n')"
fi

SIZE=$(du -sh "$OUT" | cut -f1)
echo "✓ $COUNT frames (${DURATION}s at ${FPS}fps), $SIZE total → $OUT"
echo "  Now edit $OUT/config.json so the segment times match your video."
