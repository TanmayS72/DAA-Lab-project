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
import { ArrowLeft } from "lucide-react";
import { greedyNearestNeighbour, heldKarp, TSPResult } from "@/utils/tspAlgorithms";
import { House } from "./PlanRoute";

const Compare = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<{ name: string; result: TSPResult }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedHouses = sessionStorage.getItem("houses");
    
    if (!storedHouses) {
      navigate("/plan");
      return;
    }

    const houses: House[] = JSON.parse(storedHouses);

    // Run both algorithms
    const greedyResult = greedyNearestNeighbour(houses);
    const heldKarpResult = heldKarp(houses);

    setResults([
      { name: "Greedy Nearest Neighbour", result: greedyResult },
      { name: "Dynamic Programming (Held-Karp)", result: heldKarpResult },
    ]);
    setLoading(false);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-winter py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/results")}
            className="bg-card/80 backdrop-blur-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            SANTA'S ROUTE
            <br />
            <span className="text-primary">OPTIMIZER</span>
          </h1>
          <p className="text-xl text-muted-foreground">Algorithm Comparison</p>
        </div>

        <Card className="bg-card/90 backdrop-blur-sm shadow-frost overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-lg text-muted-foreground">Computing comparisons...</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="font-bold text-secondary-foreground">
                      Algorithm
                    </TableHead>
                    <TableHead className="font-bold text-secondary-foreground text-center">
                      Total Distance
                    </TableHead>
                    <TableHead className="font-bold text-secondary-foreground text-center">
                      Computation Time
                    </TableHead>
                    <TableHead className="font-bold text-secondary-foreground text-center">
                      Steps Checked
                    </TableHead>
                    <TableHead className="font-bold text-secondary-foreground text-center">
                      Performance
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((item, index) => {
                    const isBest = item.result.distance === Math.min(...results.map(r => r.result.distance));
                    return (
                      <TableRow
                        key={item.name}
                        className={`hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? "bg-card" : "bg-muted/20"
                        }`}
                      >
                        <TableCell className="font-semibold text-foreground">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`text-lg font-bold ${isBest ? 'text-primary' : 'text-foreground'}`}>
                            {Math.round(item.result.distance)} km
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-lg font-bold text-foreground">
                            {item.result.computationTime.toFixed(3)} s
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {item.result.stepsChecked.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              isBest
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isBest ? "Optimal" : "Good"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate("/plan")}
            size="lg"
            className="bg-primary hover:bg-primary/90 shadow-glow"
          >
            Try Another Route
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Compare;
