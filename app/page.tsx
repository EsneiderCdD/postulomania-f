import ScraperPanel from "./_reusable/scraper-panel";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-1 items-center justify-center text-neutral-500">
        <p className="text-sm">Home</p>
      </div>
      <div className="p-6">
        <ScraperPanel />
      </div>
    </div>
  );
}
