Place standardized source video files here. Filenames that include the sequence id (e.g. golden_sun_djinn or ffvi_intros) will be auto-routed by scripts/extract_frames.sh into the appropriate frames output directories.

After adding videos, run:

  ./scripts/extract_frames.sh analysis/media_metadata/your_video.mp4

or to auto-scan the directory:

  ./scripts/extract_frames.sh

