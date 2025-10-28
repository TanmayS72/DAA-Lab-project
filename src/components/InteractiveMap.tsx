import { Card } from "@/components/ui/card";
import { House } from "@/pages/PlanRoute";
import { MapPin, Home, Gift, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface InteractiveMapProps {
  houses: House[];
  setHouses: (houses: House[]) => void;
  maxHouses: number;
}

const InteractiveMap = ({ houses, setHouses, maxHouses }: InteractiveMapProps) => {
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [giftsInput, setGiftsInput] = useState<string>("10");
  const [valueInput, setValueInput] = useState<string>("100");
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; x: number; delay: number; duration: number; size: number }>>([]);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    // Generate snowflakes for the map
    const flakes = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 8,
      size: 8 + Math.random() * 16,
    }));
    setSnowflakes(flakes);
  }, []);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (houses.length >= maxHouses) {
      toast.warning(`Maximum of ${maxHouses} houses reached!`);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHouse: House = {
      id: Date.now(),
      x: x,
      y: y,
      gifts: 10, // Default gift weight
      value: 100, // Default value/profit
    };

    setHouses([...houses, newHouse]);
    toast.success(`House ${houses.length + 1} placed! (Weight: 10, Value: 100)`);

    // Add sparkle effect at click location
    const sparkleId = Date.now();
    setSparkles(prev => [...prev, { id: sparkleId, x, y }]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== sparkleId));
    }, 1000);
  };

  const handleHouseClick = (house: House, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingHouse(house);
    setGiftsInput(house.gifts.toString());
    setValueInput(house.value.toString());
  };

  const handleSaveGifts = () => {
    if (!editingHouse) return;
    
    const gifts = parseInt(giftsInput) || 1;
    const value = parseInt(valueInput) || 1;
    setHouses(
      houses.map((h) =>
        h.id === editingHouse.id ? { ...h, gifts, value } : h
      )
    );
    toast.success(`House updated! Weight: ${gifts}, Value: ${value}`);
    setEditingHouse(null);
  };

  const handleRemoveHouse = () => {
    if (!editingHouse) return;
    setHouses(houses.filter((h) => h.id !== editingHouse.id));
    toast.info("House removed");
    setEditingHouse(null);
  };

  return (
    <Card className="bg-gradient-to-br from-background/80 to-muted/90 backdrop-blur-sm shadow-frost overflow-hidden border-2 border-primary/20">
      <div
        className="relative h-[600px] cursor-crosshair bg-gradient-to-br from-muted/40 via-background/50 to-secondary/20 overflow-hidden"
        onClick={handleMapClick}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.08) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, hsl(var(--secondary) / 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, hsl(var(--accent) / 0.05) 0%, transparent 50%)`,
        }}
      >
        {/* Animated Snowflakes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {snowflakes.map((flake) => (
            <div
              key={flake.id}
              className="absolute text-white/40 animate-snowfall"
              style={{
                left: `${flake.x}%`,
                animationDelay: `${flake.delay}s`,
                animationDuration: `${flake.duration}s`,
                fontSize: `${flake.size}px`,
              }}
            >
              ❄
            </div>
          ))}
        </div>

        {/* Sparkle Effects */}
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute pointer-events-none animate-scale-in z-30"
            style={{
              left: `${sparkle.x}px`,
              top: `${sparkle.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
        ))}
        {/* North Pole - Fixed at top center with glow */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center">
            {/* Outer glow rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-destructive/20 rounded-full animate-pulse blur-md"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-destructive/30 rounded-full animate-ping"></div>
            </div>
            
            <div className="relative bg-gradient-to-br from-destructive to-destructive/70 text-destructive-foreground p-4 rounded-full shadow-glow animate-pulse-glow border-2 border-destructive-foreground/20">
              <Home className="w-8 h-8" />
            </div>
            <div className="bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full mt-3 shadow-lg border border-primary/20">
              <p className="text-xs font-bold text-card-foreground whitespace-nowrap tracking-wide">
                🎅 NORTH POLE 🎄
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Grid & Patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="25" cy="25" r="1" fill="currentColor" opacity="0.3" />
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.2"
              />
            </pattern>
            <radialGradient id="mapGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="50%" cy="10%" r="15%" fill="url(#mapGlow)" />
        </svg>

        {/* Connection Lines between houses */}
        {houses.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {houses.map((house, index) => {
              if (index === 0) return null;
              const prevHouse = houses[index - 1];
              return (
                <line
                  key={`line-${house.id}`}
                  x1={prevHouse.x}
                  y1={prevHouse.y}
                  x2={house.x}
                  y2={house.y}
                   stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.3"
                  className="animate-pulse"
                />
              );
            })}
          </svg>
        )}

        {/* Houses with Effects */}
        {houses.map((house, index) => (
          <div
            key={house.id}
            className="absolute z-20 group animate-scale-in"
            style={{
              left: `${house.x}px`,
              top: `${house.y}px`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={(e) => handleHouseClick(house, e)}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg scale-150 group-hover:scale-[2] transition-transform opacity-0 group-hover:opacity-100"></div>
              
              {/* House marker */}
              <div className="relative bg-gradient-to-br from-primary to-primary/70 text-primary-foreground p-3 rounded-full shadow-lg group-hover:scale-125 transition-all cursor-pointer border-2 border-primary-foreground/20 group-hover:border-primary-foreground/40">
                <MapPin className="w-6 h-6" />
              </div>
              
              {/* Floating number badge */}
              <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md border-2 border-background">
                {index + 1}
              </div>
              
              {/* Hover tooltip */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm px-3 py-2 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-lg border border-primary/20 scale-90 group-hover:scale-100">
                <div className="text-card-foreground font-bold">🏠 House {index + 1}</div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                  <Gift className="w-3 h-3" />
                  Weight: {house.gifts}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Sparkles className="w-3 h-3" />
                  Value: {house.value}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Instructions */}
        {houses.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-card/90 backdrop-blur-md px-10 py-8 rounded-3xl shadow-2xl border-2 border-primary/30 animate-pulse-glow">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <p className="text-xl font-bold text-foreground text-center">
                  ✨ Start Planning ✨
                </p>
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <p className="text-base text-muted-foreground text-center">
                Click anywhere to place houses on the map
              </p>
              <p className="text-sm text-muted-foreground text-center mt-2">
                🎁 Click on a house to edit weight & value
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Edit House Dialog */}
      <Dialog open={!!editingHouse} onOpenChange={(open) => !open && setEditingHouse(null)}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Edit House {editingHouse && houses.findIndex(h => h.id === editingHouse.id) + 1}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="gifts" className="text-foreground">
                Number of Gifts (Weight)
              </Label>
              <Input
                id="gifts"
                type="number"
                min="1"
                max="100"
                value={giftsInput}
                onChange={(e) => setGiftsInput(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                How much capacity this house requires
              </p>
            </div>
            <div>
              <Label htmlFor="value" className="text-foreground">
                House Value (Profit/Priority)
              </Label>
              <Input
                id="value"
                type="number"
                min="1"
                max="1000"
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Importance/priority of delivering to this house
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="destructive"
              onClick={handleRemoveHouse}
            >
              Remove House
            </Button>
            <Button
              onClick={handleSaveGifts}
              className="bg-primary hover:bg-primary/90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default InteractiveMap;
