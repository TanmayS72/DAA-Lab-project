import { Card } from "@/components/ui/card";
import { House } from "@/pages/PlanRoute";
import { MapPin, Home, Gift } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
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
    };

    setHouses([...houses, newHouse]);
    toast.success(`House ${houses.length + 1} placed with 10 gifts!`);
  };

  const handleHouseClick = (house: House, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingHouse(house);
    setGiftsInput(house.gifts.toString());
  };

  const handleSaveGifts = () => {
    if (!editingHouse) return;
    
    const gifts = parseInt(giftsInput) || 1;
    setHouses(
      houses.map((h) =>
        h.id === editingHouse.id ? { ...h, gifts } : h
      )
    );
    toast.success(`House gifts updated to ${gifts}!`);
    setEditingHouse(null);
  };

  const handleRemoveHouse = () => {
    if (!editingHouse) return;
    setHouses(houses.filter((h) => h.id !== editingHouse.id));
    toast.info("House removed");
    setEditingHouse(null);
  };

  return (
    <Card className="bg-winter-teal/30 backdrop-blur-sm shadow-frost overflow-hidden">
      <div
        className="relative h-[600px] cursor-crosshair bg-gradient-to-br from-frosty-blue/20 to-winter-teal/20"
        onClick={handleMapClick}
      >
        {/* North Pole - Fixed at top center */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
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

        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <defs>
            <pattern
              id="grid"
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
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Houses */}
        {houses.map((house, index) => (
          <div
            key={house.id}
            className="absolute z-20 group"
            style={{
              left: `${house.x}px`,
              top: `${house.y}px`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={(e) => handleHouseClick(house, e)}
          >
            <div className="relative">
              <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg group-hover:scale-125 transition-transform cursor-pointer">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-card px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                <div>House {index + 1}</div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Gift className="w-3 h-3" />
                  {house.gifts}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Instructions */}
        {houses.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-card/80 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-frost">
              <p className="text-lg text-muted-foreground text-center">
                Click anywhere to place houses
              </p>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Click on a house to edit gifts
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
