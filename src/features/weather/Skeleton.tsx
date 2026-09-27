const Block = ({ className }: { className: string }) => <div className={`animate-pulse rounded-[var(--radius-card)] bg-white/12 ${className}`} />;

/** Placeholder shaped like the real screen, so nothing jumps when data arrives */
const Skeleton = () => (
  <div aria-busy="true" aria-live="polite" className="lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-6">
    <span className="sr-only">Loading the forecast…</span>
    <div className="flex flex-col gap-3">
      <div className="flex flex-col items-center gap-3 pb-2 pt-6 lg:items-start">
        <Block className="h-24 w-44 rounded-2xl" />
        <Block className="h-6 w-40 rounded-full" />
        <Block className="h-5 w-56 rounded-full" />
      </div>
      <Block className="h-44" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Block key={i} className="h-40" />
        ))}
      </div>
    </div>
    <Block className="mt-3 h-[420px] lg:mt-0" />
  </div>
);

export default Skeleton;
