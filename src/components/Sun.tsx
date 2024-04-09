import { motion, type ValueAnimationTransition } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Sun(props: any) {
  const [isDayTime, setIsDayTime] = useState(true);
  const animationRef = useRef(null);
  const [timer, setTimer] = useState(0);
  const dayDuration = props.dayDuration;
  const animationTransition: ValueAnimationTransition = {
    duration: dayDuration,
    ease: "linear",
    repeat: Infinity,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev >= dayDuration - 1) {
          setIsDayTime((prevIsDayTime) => !prevIsDayTime); // Use functional form of setIsDayTime
          return 0; // Reset timer to 0 when it reaches 2
        } else {
          return prev + 1; // Increment timer
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function dayTimeEffects() {
    return isDayTime ? "brightness-100 saturation-100" : "brightness-[0.5] drop-shadow-md";
  }

  return <motion.img ref={animationRef} style={{ translateX: "-100px", translateY: "200px",zIndex:0 }} animate={{ translateX: [-100, 2000], translateY: [200, 100, 0, -100, 0, 100, 200] }} transition={animationTransition} src="/assets/sun.png" alt="The Sun" className={"w-auto object-cover absolute " + dayTimeEffects()} />;
}
