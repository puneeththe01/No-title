import { Parallax, ParallaxLayer, IParallax } from "@react-spring/parallax";
import { useRef } from "react";

const HomePage = () => {
  const parallaxRef = useRef<IParallax>(null);

  return (
    <Parallax pages={4} ref={parallaxRef}>
      <ParallaxLayer
        offset={0}
        speed={1}
        factor={1}
        className="bg-[url('/panel-view.jpg')]"
      />
      <ParallaxLayer offset={1} speed={0.5} factor={1} />
      <ParallaxLayer offset={2} speed={1} factor={1}>
        <img
          src="/cube-image.jpeg"
          alt="backgound image"
          className="w-screen"
        />
        <div className="border">this is 3 ParallaxLayer</div>
      </ParallaxLayer>
      <ParallaxLayer />
    </Parallax>
  );
};

export default HomePage;
