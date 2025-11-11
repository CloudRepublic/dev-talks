import { useState } from "react";
import KeywordFilter from "../KeywordFilter";

export default function KeywordFilterExample() {
  const keywords = ["AI", "Cloud", "DevOps", "Python", "C#", "Security", "Frontend", "Backend"];
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(["AI", "Cloud"]);

  const handleToggle = (keyword: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  };

  return (
    <div className="p-6">
      <KeywordFilter
        keywords={keywords}
        selectedKeywords={selectedKeywords}
        onToggleKeyword={handleToggle}
        onClearAll={() => setSelectedKeywords([])}
      />
    </div>
  );
}
