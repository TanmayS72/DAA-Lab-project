import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import santaSleigh from "@/assets/santa-sleigh.png";
import backgroundImage from "@/assets/todd-diemer-67t2GJcD5PI-unsplash.jpg";
import { MapPin, Zap, BarChart3 } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8)',
        }}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/30" />

      {/* Animated snowflakes */}
      <div className="absolute inset-0 pointer-events-none z-[5]">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/60 animate-snowfall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
              fontSize: `${8 + Math.random() * 24}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <div className="text-center space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-card/90 backdrop-blur-md border border-primary/30 rounded-full px-6 py-3 shadow-lg">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-primary tracking-wide">CHRISTMAS DELIVERY OPTIMIZATION</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl leading-tight">
              SANTA'S ROUTE
              <br />
              <span className="bg-gradient-festive bg-clip-text text-transparent animate-pulse-glow">
                OPTIMIZER
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl font-semibold text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              🎄 Ho Ho Ho! Let's optimize Santa's journey! ✨
            </p>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Find the most efficient path for Santa to deliver presents using advanced algorithms and AI-powered route planning
            </p>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 blur-3xl animate-pulse"></div>
            <div className="relative animate-float">
              <img
                src={santaSleigh}
                alt="Santa's Sleigh flying through the night sky"
                className="w-full max-w-lg drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate("/plan")}
              className="group text-xl font-bold px-10 py-7 bg-gradient-festive hover:opacity-90 shadow-glow hover:shadow-frost transition-all duration-300 hover:scale-110 rounded-2xl border-2 border-primary/20"
            >
              <MapPin className="mr-2 group-hover:rotate-12 transition-transform" />
              START PLANNING
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/compare")}
              className="text-lg px-8 py-7 bg-card/80 backdrop-blur-sm border-2 border-primary/30 hover:bg-primary/10 hover:border-primary text-foreground transition-all duration-300 hover:scale-105 rounded-2xl"
            >
              <BarChart3 className="mr-2" />
              Compare Algorithms
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-28 max-w-6xl mx-auto">
          <div className="group bg-gradient-to-br from-card/95 to-primary/10 backdrop-blur-md p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-primary/20 hover:border-primary/40">
            <div className="bg-gradient-to-br from-primary to-primary/70 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <MapPin className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors">
              Interactive Mapping
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              Place house markers on an interactive map starting from the North Pole and watch the magic happen
            </p>
          </div>

          <div className="group bg-gradient-to-br from-card/95 to-accent/10 backdrop-blur-md p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-accent/20 hover:border-accent/40">
            <div className="bg-gradient-to-br from-accent to-accent/70 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Zap className="w-10 h-10 text-accent-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground mb-3 group-hover:text-accent transition-colors">
              Smart Algorithms
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              Choose from multiple pathfinding algorithms to optimize the route with AI precision
            </p>
          </div>

          <div className="group bg-gradient-to-br from-card/95 to-destructive/10 backdrop-blur-md p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-destructive/20 hover:border-destructive/40">
            <div className="bg-gradient-to-br from-destructive to-destructive/70 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <BarChart3 className="w-10 h-10 text-destructive-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground mb-3 group-hover:text-destructive transition-colors">
              Compare Results
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              Analyze and compare performance metrics across different algorithms in real-time
            </p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="relative z-10 bg-card/90 backdrop-blur-md border-t border-primary/20 text-center py-6 mt-20">
        <p className="text-sm text-muted-foreground">© 2025 Santa's Route Optimizer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
