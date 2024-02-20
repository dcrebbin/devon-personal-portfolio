import { motion, type ValueAnimationTransition } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Sun() {
  const [isDayTime, setIsDayTime] = useState(true);
  const animationRef = useRef(null);
  const [timer, setTimer] = useState(0);
    const dayDuration = 100;
  const animationTransition: ValueAnimationTransition = {
    duration: dayDuration,
    ease: "linear",
    repeat: Infinity,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev >= dayDuration-1) {
           
          setIsDayTime((prevIsDayTime) => !prevIsDayTime); // Use functional form of setIsDayTime
          return 0; // Reset timer to 0 when it reaches 2
        } else {
          return prev + 1; // Increment timer
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function dayTimeEffects(){
    return isDayTime ? "brightness-100 saturation-100" : "brightness-[0.5] drop-shadow-md";
  }

  return (
    <motion.div className={"w-full  h-full fixed z-[10] pointer-events-auto transition-all"} animate={{ backdropFilter: isDayTime ? ["brightness(0.7)", "brightness(1)", "brightness(0.9)", "brightness(0.3)"] : ["brightness(0.3) grayscale(20)","brightness(0.02) grayscale(0.2)","brightness(0.05) grayscale(0.5)","brightness(0.7) grayscale(0.3)"] }} transition={animationTransition}>
      <motion.img ref={animationRef} animate={{ translateX: [-100, 2000], translateY: [200, -100, 200]}} transition={animationTransition} src="/assets/sun.png" alt="The Sun" className={"w-auto object-cover absolute z-0 " +dayTimeEffects()} />
    </motion.div>
  );
}
