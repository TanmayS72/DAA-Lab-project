import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sleighIcon from "@/assets/sleigh-icon.png";
import { greedyNearestNeighbour, heldKarp, knapsack } from "@/utils/tspAlgorithms";
import { House } from "./PlanRoute";

const Processing = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing route optimization...");

  const statusMessages = [
    "Initializing route optimization...",
    "Loading house coordinates...",
    "Calculating distances...",
    "Running algorithm...",
    "Optimizing path...",
    "Almost there...",
  ];

  useEffect(() => {
      const storedHouses = sessionStorage.getItem("houses");
      const storedAlgorithm = sessionStorage.getItem("algorithm");
      const storedCapacity = sessionStorage.getItem("capacity");
      const storedUseCapacity = sessionStorage.getItem("useCapacityConstraint");

      if (!storedHouses || !storedAlgorithm) {
        navigate("/plan");
        return;
      }

      let houses: House[] = JSON.parse(storedHouses);
      const useCapacityConstraint = storedUseCapacity === "true";
      const capacity = parseInt(storedCapacity || "100");

      let knapsackResult = null;

      // Apply knapsack if capacity constraint is enabled
      if (useCapacityConstraint && houses.length > 0) {
        setStatus("Applying capacity constraints...");
        knapsackResult = knapsack(houses, capacity);
        
        // Filter houses to only selected ones
        const selectedHouses = knapsackResult.selectedIndices.map(idx => houses[idx]);
        
        if (selectedHouses.length === 0) {
          setStatus("No houses fit within capacity!");
          setTimeout(() => {
            sessionStorage.setItem("result", JSON.stringify({
              path: [],
              distance: 0,
              computationTime: 0,
              stepsChecked: 0,
              selectedHouses: [],
              skippedHouses: knapsackResult.skippedIndices,
              totalWeight: 0,
            }));
            navigate("/results");
          }, 2000);
          return;
        }
        
        houses = selectedHouses;
      }

    const duration = 3000; // 3 seconds
    const interval = 50;
    const steps = duration / interval;
    const increment = 100 / steps;

    let currentProgress = 0;
    let messageIndex = 0;

    const timer = setInterval(() => {
      currentProgress += increment;
      setProgress(Math.min(currentProgress, 100));

      // Update status message
      const newMessageIndex = Math.floor((currentProgress / 100) * statusMessages.length);
      if (newMessageIndex !== messageIndex && newMessageIndex < statusMessages.length) {
        messageIndex = newMessageIndex;
        setStatus(statusMessages[messageIndex]);
      }

      if (currentProgress >= 100) {
        clearInterval(timer);
        
        // Execute algorithm
        setStatus("Computing optimal route...");
        let result;

        if (storedAlgorithm === "greedy") {
          result = greedyNearestNeighbour(houses);
        } else {
          result = heldKarp(houses);
        }

        // Add knapsack info to result if it was used
        if (knapsackResult) {
          result.selectedHouses = knapsackResult.selectedIndices;
          result.skippedHouses = knapsackResult.skippedIndices;
          result.totalWeight = knapsackResult.totalWeight;
        }

        setProgress(100);
        setStatus("Route optimized!");

        // Store result
        sessionStorage.setItem("result", JSON.stringify(result));

        // Navigate to results
        setTimeout(() => {
          navigate("/results");
        }, 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-winter flex items-center justify-center relative overflow-hidden">
      {/* Animated snowflakes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/20 animate-snowfall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
              fontSize: `${15 + Math.random() * 25}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Computing...
        </h1>

        {/* Animated Sleigh */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32 animate-float">
            <img
              src={sleighIcon}
              alt="Santa's Sleigh"
              className="w-full h-full drop-shadow-2xl"
            />
            <div className="absolute inset-0 animate-pulse-glow rounded-full" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-card/80 backdrop-blur-sm rounded-full h-4 overflow-hidden shadow-frost">
            <div
              className="bg-gradient-festive h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-lg text-muted-foreground animate-pulse">
            {status}
          </p>

          <p className="text-3xl font-bold text-primary">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Processing;
