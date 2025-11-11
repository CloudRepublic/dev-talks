import EpisodeCard from "../EpisodeCard";

export default function EpisodeCardExample() {
  return (
    <div className="p-6">
      <EpisodeCard
        title="59. Green software development"
        description="In deze aflevering spreken we met Wilco Burggraaf over een onderwerp dat steeds relevanter wordt: green software development. Wat betekent dat eigenlijk, en hoe kunnen developers concreet bijdragen aan duurzamere digitale oplossingen? We verkennen het verschil tussen energie-efficiënte en duurzame software, hoe je als developer groene keuzes maakt in code, architectuur én cloudgebruik."
        pubDate="2025-05-06T11:00:00+02:00"
        duration="1:00:57"
        imageUrl="https://storage.buzzsprout.com/71vde3tb74rrwjfbgjels9kgf5jh?.jpg"
        onPlay={() => console.log("Play episode")}
      />
    </div>
  );
}
