
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface SlideProps {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonAction: () => void;
  position?: "left" | "center" | "right";
}

interface SlideshowProps {
  slides: SlideProps[];
  autoplayInterval?: number;
  className?: string;
  showControls?: boolean;
  showDots?: boolean;
}

const Slideshow = ({
  slides,
  autoplayInterval = 5000,
  className,
  showControls = true,
  showDots = true,
}: SlideshowProps) => {
  const [api, setApi] = React.useState<any>(null);

  // Autoplay effect
  useEffect(() => {
    if (!api || autoplayInterval <= 0) return;
    
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, autoplayInterval);
    
    return () => clearInterval(interval);
  }, [api, autoplayInterval]);

  return (
    <Carousel
      opts={{ loop: true, align: "start" }}
      setApi={setApi}
      className={cn("w-full relative", className)}
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
              
              {/* Image */}
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover" 
              />
              
              {/* Content */}
              <div className={cn(
                "absolute inset-0 flex flex-col justify-center p-8 z-20 text-white",
                slide.position === "left" ? "items-start text-left" : 
                slide.position === "right" ? "items-end text-right" : 
                "items-center text-center"
              )}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-md">
                  {slide.title}
                </h2>
                <p className="text-base md:text-lg mb-6 max-w-md opacity-90">
                  {slide.description}
                </p>
                <Button 
                  onClick={slide.buttonAction}
                  size="lg"
                  className="bg-unigames-purple hover:bg-unigames-purple/80 button-glow"
                >
                  <Play className="mr-2 h-4 w-4" /> {slide.buttonText}
                </Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      
      {showControls && (
        <>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </>
      )}
      
      {showDots && (
        <CarouselDots className="absolute bottom-4 left-0 right-0 z-20" />
      )}
    </Carousel>
  );
};

export default Slideshow;
