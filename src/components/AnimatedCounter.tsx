import { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  containerClassName?: string;
}

export default function AnimatedCounter({ 
  value, 
  duration = 500, 
  className = '',
  containerClassName = ''
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = Math.floor(easeOutExpo * value);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <div className={`inline-flex items-center gap-2 ${containerClassName}`}>
      <div className={`bg-white border-2 border-[#15803d] shadow-[4px_4px_0px_0px_#052e16] px-3 py-2 sm:px-4 sm:py-2 ${className}`}>
        <span className="font-mono tabular-nums font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#15803d]">
          {displayValue.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
