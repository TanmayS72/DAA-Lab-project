import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RouteMap from "@/components/RouteMap";
import { House } from "./PlanRoute";
import { ArrowLeft, BarChart3 } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-white py-8">
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="space-y-4">
            <Card className="p-6 bg-card/90 backdrop-blur-sm shadow-frost">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Algorithm Used
              </h3>
              <p className="text-2xl font-bold text-primary">
                {getAlgorithmName()}
              </p>
            </Card>

            {hasCapacityConstraint && (
              <>
                <Card className="p-6 bg-card/90 backdrop-blur-sm shadow-frost">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Houses Selected
                  </h3>
                  <p className="text-3xl font-bold text-green-600">
                    {selectedCount} <span className="text-xl">selected</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {skippedCount} skipped due to capacity
                  </p>
                </Card>

                <Card className="p-6 bg-card/90 backdrop-blur-sm shadow-frost">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Total Weight
                  </h3>
                  <p className="text-3xl font-bold text-foreground">
                    {totalWeight} <span className="text-xl">gifts</span>
                  </p>
                </Card>
              </>
            )}

            <Card className="p-6 bg-card/90 backdrop-blur-sm shadow-frost">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Total Distance
              </h3>
              <p className="text-3xl font-bold text-foreground">
                {distance} <span className="text-xl">km</span>
              </p>
            </Card>

            <Card className="p-6 bg-card/90 backdrop-blur-sm shadow-frost">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Computation Time
              </h3>
              <p className="text-3xl font-bold text-foreground">
                {computationTime.toFixed(2)} <span className="text-xl">s</span>
              </p>
            </Card>

            <Card className="p-6 bg-card/90 backdrop-blur-sm shadow-frost">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Houses Visited
              </h3>
              <p className="text-3xl font-bold text-foreground">{houses.length}</p>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <RouteMap houses={houses} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;