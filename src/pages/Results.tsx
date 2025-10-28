import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RouteMap from "@/components/RouteMap";
import { House } from "./PlanRoute";
import { ArrowLeft, BarChart3, MapPin, Package, TrendingUp } from "lucide-react";

const Results = () => {
  const navigate = useNavigate();
  const [houses, setHouses] = useState<House[]>([]);
  const [allHouses, setAllHouses] = useState<House[]>([]);
  const [algorithm, setAlgorithm] = useState<string>("");
  const [distance, setDistance] = useState<number>(0);
  const [computationTime, setComputationTime] = useState<number>(0);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [skippedCount, setSkippedCount] = useState<number>(0);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [hasCapacityConstraint, setHasCapacityConstraint] = useState<boolean>(false);

  useEffect(() => {
    const storedHouses = sessionStorage.getItem("houses");
    const storedAlgorithm = sessionStorage.getItem("algorithm");
    const storedResult = sessionStorage.getItem("result");

    if (!storedHouses || !storedAlgorithm || !storedResult) {
      navigate("/plan");
      return;
    }

    const parsedHouses = JSON.parse(storedHouses);
    const result = JSON.parse(storedResult);

    // Check if capacity constraint was used
    const hasConstraint = result.selectedHouses !== undefined;
    setHasCapacityConstraint(hasConstraint);

    if (hasConstraint) {
      // With capacity constraint
      const selectedHouses = result.selectedHouses.map((index: number) => parsedHouses[index]);
      const orderedHouses = result.path.map((index: number) => selectedHouses[index]);
      
      setHouses(orderedHouses);
      setAllHouses(parsedHouses);
      setSelectedCount(result.selectedHouses.length);
      setSkippedCount(result.skippedHouses?.length || 0);
      setTotalWeight(result.totalWeight || 0);
    } else {
      // Without capacity constraint
      const orderedHouses = result.path.map((index: number) => parsedHouses[index]);
      setHouses(orderedHouses);
      setAllHouses(parsedHouses);
    }
    
    setAlgorithm(storedAlgorithm);
    setDistance(Math.round(result.distance));
    setComputationTime(result.computationTime);
  }, [navigate]);

  const getAlgorithmName = () => {
    const names: { [key: string]: string } = {
      "greedy": "Greedy Nearest Neighbour",
      "held-karp": "Dynamic Programming (Held-Karp)",
    };
    return names[algorithm] || algorithm;
  };

  return (
    <div className="min-h-screen bg-gradient-winter py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/plan")}
            className="bg-card/80 backdrop-blur-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plan
          </Button>

          <h1 className="text-4xl font-bold text-foreground">Route Results</h1>

          <Button
            onClick={() => navigate("/compare")}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Compare
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Stats Cards */}
          <div className="space-y-3 lg:col-span-1">
            <Card className="p-4 bg-card/90 backdrop-blur-sm shadow-frost">
              <h3 className="text-xs font-medium text-muted-foreground mb-1">
                Algorithm Used
              </h3>
              <p className="text-lg font-bold text-primary">
                {getAlgorithmName()}
              </p>
            </Card>

            {hasCapacityConstraint && (
              <>
                <Card className="p-4 bg-card/90 backdrop-blur-sm shadow-frost">
                  <h3 className="text-xs font-medium text-muted-foreground mb-1">
                    Houses Selected
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedCount} <span className="text-base">selected</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {skippedCount} skipped due to capacity
                  </p>
                </Card>

                <Card className="p-4 bg-card/90 backdrop-blur-sm shadow-frost">
                  <h3 className="text-xs font-medium text-muted-foreground mb-1">
                    Total Weight
                  </h3>
                  <p className="text-2xl font-bold text-foreground">
                    {totalWeight} <span className="text-base">gifts</span>
                  </p>
                </Card>
              </>
            )}

            <Card className="p-4 bg-card/90 backdrop-blur-sm shadow-frost">
              <h3 className="text-xs font-medium text-muted-foreground mb-1">
                Total Distance
              </h3>
              <p className="text-2xl font-bold text-foreground">
                {distance} <span className="text-base">km</span>
              </p>
            </Card>

            <Card className="p-4 bg-card/90 backdrop-blur-sm shadow-frost">
              <h3 className="text-xs font-medium text-muted-foreground mb-1">
                Computation Time
              </h3>
              <p className="text-2xl font-bold text-foreground">
                {computationTime.toFixed(2)} <span className="text-base">s</span>
              </p>
            </Card>

            <Card className="p-4 bg-card/90 backdrop-blur-sm shadow-frost">
              <h3 className="text-xs font-medium text-muted-foreground mb-1">
                Houses Visited
              </h3>
              <p className="text-2xl font-bold text-foreground">{houses.length}</p>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 self-stretch">
            <RouteMap houses={houses} />
          </div>
        </div>

        {/* Route Details Table */}
        <Card className="p-6 bg-card/90 backdrop-blur-sm shadow-frost mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Optimized Route Order
          </h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Stop #</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">
                    <Package className="inline h-4 w-4 mr-1" />
                    Gifts
                  </TableHead>
                  <TableHead className="text-right">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    Value
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {houses.map((house, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      ({house.x.toFixed(0)}, {house.y.toFixed(0)})
                    </TableCell>
                    <TableCell className="text-right">{house.gifts}</TableCell>
                    <TableCell className="text-right">{house.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Skipped Houses Table */}
        {hasCapacityConstraint && skippedCount > 0 && (
          <Card className="p-6 bg-card/90 backdrop-blur-sm shadow-frost">
            <h2 className="text-2xl font-bold text-destructive mb-4">
              Skipped Houses ({skippedCount})
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              These houses were not selected due to sleigh capacity constraints
            </p>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">
                      <Package className="inline h-4 w-4 mr-1" />
                      Gifts
                    </TableHead>
                    <TableHead className="text-right">
                      <TrendingUp className="inline h-4 w-4 mr-1" />
                      Value
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allHouses
                    .filter((_, idx) => !houses.some(h => h.x === allHouses[idx].x && h.y === allHouses[idx].y))
                    .map((house, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          ({house.x.toFixed(0)}, {house.y.toFixed(0)})
                        </TableCell>
                        <TableCell className="text-right">{house.gifts}</TableCell>
                        <TableCell className="text-right">{house.value}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Results;
