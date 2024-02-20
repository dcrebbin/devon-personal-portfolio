import { motion, type ValueAnimationTransition } from "framer-motion";
import { useEffect, useState } from "react";

export default function Sun(props: any) {
  const [isDayTime, setIsDayTime] = useState(true);
  const [timer, setTimer] = useState(0);
  const dayDuration = props.dayDuration;
  const animationTransition: ValueAnimationTransition = {
    duration: dayDuration,
    ease: "linear",
    repeat: Infinity,
  };

  const dayTimeAnimation = ["brightness(0.7)", "brightness(1)", "brightness(0.9)", "brightness(0.3)"];
  const nightTimeAnimation = ["brightness(0.2) grayscale(0.3)", "brightness(0.25) grayscale(0.2)", "brightness(0.3) grayscale(0.5)", "brightness(0.7) grayscale(0.3)"];

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

  return <motion.div className={"w-full h-full fixed z-[99] pointer-events-auto transition-all"} animate={{ WebkitBackdropFilter: isDayTime ? [...dayTimeAnimation] : nightTimeAnimation, backdropFilter: isDayTime ? dayTimeAnimation : [nightTimeAnimation] }} transition={animationTransition}></motion.div>;
}
