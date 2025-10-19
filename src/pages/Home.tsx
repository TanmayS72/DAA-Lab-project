import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import santaSleigh from "@/assets/santa-sleigh.png";
import { MapPin, Zap, BarChart3 } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-winter relative overflow-hidden">
      {/* Animated snowflakes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/30 animate-snowfall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
              fontSize: `${10 + Math.random() * 20}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground drop-shadow-lg">
              SANTA'S ROUTE
              <br />
              <span className="text-primary">OPTIMIZER</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Welcome to Santa's Route Optimizer!
            </p>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Find the most efficient path for Santa to deliver presents using advanced algorithms
            </p>
          </div>

          <div className="flex justify-center animate-float">
            <img
              src={santaSleigh}
              alt="Santa's Sleigh"
              className="w-full max-w-md drop-shadow-2xl"
            />
          </div>

          <Button
            size="lg"
            onClick={() => navigate("/plan")}
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-glow hover:shadow-frost transition-all duration-300 hover:scale-105"
          >
            PLAN ROUTE
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-card/80 backdrop-blur-sm p-6 rounded-2xl shadow-frost hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Interactive Mapping
            </h3>
            <p className="text-muted-foreground">
              Place house markers on an interactive map starting from the North Pole
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm p-6 rounded-2xl shadow-frost hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Zap className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Smart Algorithms
            </h3>
            <p className="text-muted-foreground">
              Choose from multiple pathfinding algorithms to optimize the route
            </p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm p-6 rounded-2xl shadow-frost hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
            <div className="bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <BarChart3 className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Compare Results
            </h3>
            <p className="text-muted-foreground">
              Analyze and compare performance metrics across different algorithms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
