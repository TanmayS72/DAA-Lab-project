import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import InteractiveMap from "@/components/InteractiveMap";
import { toast } from "sonner";

export interface House {
  id: number;
  x: number;
  y: number;
  gifts: number;
}

const PlanRoute = () => {
  const navigate = useNavigate();
  const [numHouses, setNumHouses] = useState<number>(10);
  const [algorithm, setAlgorithm] = useState<string>("greedy");
  const [houses, setHouses] = useState<House[]>([]);
  const [capacity, setCapacity] = useState<number>(100);
  const [useCapacityConstraint, setUseCapacityConstraint] = useState<boolean>(false);

  const handleOptimize = () => {
    if (houses.length === 0) {
      toast.error("Please add at least one house to the map!");
      return;
    }
    
    if (houses.length !== numHouses) {
      toast.warning(`You've placed ${houses.length} houses but selected ${numHouses}. Continuing with ${houses.length} houses.`);
    }

    // Store data in sessionStorage for the results page
    sessionStorage.setItem("houses", JSON.stringify(houses));
    sessionStorage.setItem("algorithm", algorithm);
    sessionStorage.setItem("capacity", capacity.toString());
    sessionStorage.setItem("useCapacityConstraint", useCapacityConstraint.toString());
    
    navigate("/processing");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center drop-shadow-lg">
          Plan Your Route
        </h1>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="lg:col-span-1 p-6 bg-secondary/90 backdrop-blur-sm shadow-frost">
            <div className="space-y-6">
              <div>
                <Label htmlFor="num-houses" className="text-secondary-foreground font-semibold mb-2 block">
                  Number of Houses
                </Label>
                <Input
                  id="num-houses"
                  type="number"
                  min="1"
                  max="50"
                  value={numHouses}
                  onChange={(e) => setNumHouses(parseInt(e.target.value) || 1)}
                  className="bg-card"
                />
              </div>

              <div>
                <Label htmlFor="algorithm" className="text-secondary-foreground font-semibold mb-2 block">
                  Algorithm
                </Label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger id="algorithm" className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="greedy">Greedy Nearest Neighbour</SelectItem>
                    <SelectItem value="held-karp">Dynamic Programming (Held-Karp)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-secondary-foreground/20">
                <div className="flex items-center justify-between">
                  <Label htmlFor="capacity-toggle" className="text-secondary-foreground font-semibold cursor-pointer">
                    Enable Capacity Constraint
                  </Label>
                  <Switch
                    id="capacity-toggle"
                    checked={useCapacityConstraint}
                    onCheckedChange={setUseCapacityConstraint}
                  />
                </div>
              </div>

              {useCapacityConstraint && (
                <div>
                  <Label htmlFor="capacity" className="text-secondary-foreground font-semibold mb-2 block">
                    Reindeer Capacity (max weight)
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="1000"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                    className="bg-card"
                  />
                </div>
              )}

              <Button
                onClick={handleOptimize}
                className="w-full bg-primary hover:bg-primary/90 shadow-glow transition-all duration-300"
                size="lg"
              >
                OPTIMIZE ROUTE
              </Button>

              <div className="pt-4 border-t border-secondary-foreground/20">
                <p className="text-sm text-secondary-foreground/70 mb-2">
                  Houses placed: {houses.length} / {numHouses}
                </p>
                <p className="text-xs text-secondary-foreground/60">
                  Click on house to edit gifts, click map to add
                </p>
              </div>
            </div>
          </Card>

          {/* Map Area */}
          <div className="lg:col-span-3">
            <InteractiveMap
              houses={houses}
              setHouses={setHouses}
              maxHouses={numHouses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanRoute;