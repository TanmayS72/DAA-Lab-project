import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { House } from "@/pages/PlanRoute";
import { MapPin, Home } from "lucide-react";
import sleighIcon from "@/assets/sleigh-icon.png";

interface RouteMapProps {
  houses: House[];
}

const RouteMap = ({ houses }: RouteMapProps) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const duration = 5000; // 5 seconds for full animation
    const interval = 50;
    const steps = duration / interval;
    const increment = 100 / steps;

    let progress = 0;
    const timer = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
      }
      setAnimationProgress(progress);
    }, interval);

    return () => clearInterval(timer);
  }, [houses]);

  // Calculate the current position of the sleigh based on animation progress
  const getSleighPosition = () => {
    if (houses.length === 0) return { x: 0, y: 0 };

    const totalSegments = houses.length;
    const currentSegment = Math.floor((animationProgress / 100) * totalSegments);
    const segmentProgress = ((animationProgress / 100) * totalSegments) % 1;

    if (currentSegment >= houses.length) {
      return houses[houses.length - 1];
    }

    if (currentSegment === 0) {
      const northPoleX = 400; // Center of map
      const northPoleY = 50;
      const targetHouse = houses[0];
      return {
        x: northPoleX + (targetHouse.x - northPoleX) * segmentProgress,
        y: northPoleY + (targetHouse.y - northPoleY) * segmentProgress,
      };
    }

    const startHouse = houses[currentSegment - 1];
    const endHouse = houses[currentSegment];

    return {
      x: startHouse.x + (endHouse.x - startHouse.x) * segmentProgress,
      y: startHouse.y + (endHouse.y - startHouse.y) * segmentProgress,
    };
  };

  const sleighPosition = getSleighPosition();
  const northPoleX = 400;
  const northPoleY = 50;

  return (
    <Card className="bg-winter-teal/30 backdrop-blur-sm shadow-frost overflow-hidden">
      <div className="relative h-[600px] bg-gradient-to-br from-frosty-blue/20 to-winter-teal/20">
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <defs>
            <pattern
              id="results-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#results-grid)" />
        </svg>

        {/* Route Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {/* Line from North Pole to first house */}
          {houses.length > 0 && (
            <line
              x1={northPoleX}
              y1={northPoleY}
              x2={houses[0].x}
              y2={houses[0].y}
              stroke="hsl(var(--destructive))"
              strokeWidth="3"
              strokeDasharray="5,5"
              opacity="0.6"
            />
          )}

          {/* Lines between houses */}
          {houses.map((house, index) => {
            if (index === houses.length - 1) return null;
            const nextHouse = houses[index + 1];
            return (
              <line
                key={house.id}
                x1={house.x}
                y1={house.y}
                x2={nextHouse.x}
                y2={nextHouse.y}
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray="5,5"
                opacity="0.6"
              />
            );
          })}
        </svg>

        {/* North Pole */}
        <div
          className="absolute z-20"
          style={{
            left: `${northPoleX}px`,
            top: `${northPoleY}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="flex flex-col items-center">
            <div className="bg-destructive text-destructive-foreground p-3 rounded-full shadow-glow animate-pulse-glow">
              <Home className="w-8 h-8" />
            </div>
            <div className="bg-card px-3 py-1 rounded-full mt-2 shadow-md">
              <p className="text-xs font-semibold text-card-foreground whitespace-nowrap">
                NORTH POLE
              </p>
            </div>
          </div>
        </div>

        {/* Houses */}
        {houses.map((house, index) => (
          <div
            key={house.id}
            className="absolute z-20"
            style={{
              left: `${house.x}px`,
              top: `${house.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative">
              <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-card px-2 py-0.5 rounded text-xs font-semibold shadow-md">
                {index + 1}
              </div>
            </div>
          </div>
        ))}

        {/* Animated Sleigh */}
        {animationProgress < 100 && (
          <div
            className="absolute z-30 transition-all duration-100 ease-linear"
            style={{
              left: `${sleighPosition.x}px`,
              top: `${sleighPosition.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <img
              src={sleighIcon}
              alt="Santa's Sleigh"
              className="w-12 h-12 drop-shadow-lg"
            />
          </div>
        )}

        {/* Animation Complete Message */}
        {animationProgress === 100 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
            <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-glow animate-pulse-glow">
              <p className="font-semibold">Route Complete! 🎄</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RouteMap;
