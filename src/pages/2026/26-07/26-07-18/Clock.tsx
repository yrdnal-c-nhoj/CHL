import { useEffect, useState } from 'react';

const SweepClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let animationFrameId;

    const update = () => {
      setTime(new Date());
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const ms = time.getMilliseconds();
  
  // 1. Seconds calculations (Continuous sweep)
  const seconds = time.getSeconds() + ms / 1000;
  const secondDegrees = (seconds / 60) * 360;

  // 2. Minutes calculations (Continuous sweep based on minutes + seconds elapsed)
  const minutes = time.getMinutes() + seconds / 60;
  const minuteDegrees = (minutes / 60) * 360;

  // 3. Hours calculations (Continuous sweep based on 12-hour cycle + minutes elapsed)
  const hours = (time.getHours() % 12) + minutes / 60;
  const hourDegrees = (hours / 12) * 360;

  return (
    // Outer responsive centering container
    <div className="box-border flex items-center justify-center w-full h-screen p-8 bg-white">
      {/* Aspect-locked relative container for layout layering */}
      <div className="relative flex items-center justify-center w-full h-full max-w-full max-h-full aspect-square">
        
        {/* LAYER 1: OUTER RING - SECONDS (Full Size) */}
        <div
          className="absolute inset-0 transition-transform duration-75 rounded-full shadow-2xl"
          style={{
            background: `conic-gradient(from ${secondDegrees}deg, #CC081C 0deg, #f0f0f0 360deg, transparent 33deg)`,
          }}
        />

        {/* LAYER 2: MIDDLE RING - MINUTES (Scaled down slightly) */}
        <div
          className="absolute inset-0 rounded-full scale-[0.90] shadow-inner"
          style={{
            background: `conic-gradient(from ${minuteDegrees}deg, #071BD0 0deg, #f3f3f3 360deg, transparent 4deg)`,
          }}
        />

        {/* LAYER 3: INNER RING - HOURS (Smallest inner layer) */}
        <div
          className="absolute inset-0 rounded-full scale-[0.70]"
          style={{
            background: `conic-gradient(from ${hourDegrees}deg, #5604A2 0deg, #f6f6f6 360deg, transparent 6deg)`,
          }}
        />

        {/* CENTER MATTE (Optional: Cleans up the center core so it looks like rings) */}
        <div className="absolute inset-0 rounded-full scale-[0.45] bg-white shadow-2xl flex flex-col items-center justify-center text-slate-900 font-mono text-sm sm:text-lg" />

      </div>
    </div>
  );
};

export default SweepClock;