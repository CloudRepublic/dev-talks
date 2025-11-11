import AudioPlayer from "../AudioPlayer";

export default function AudioPlayerExample() {
  return (
    <div className="relative h-32">
      <AudioPlayer
        episodeTitle="59. Green software development"
        audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        imageUrl="https://storage.buzzsprout.com/71vde3tb74rrwjfbgjels9kgf5jh?.jpg"
        onClose={() => console.log("Close player")}
      />
    </div>
  );
}
