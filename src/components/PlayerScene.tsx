import { useEffect, useState } from "react";
import { motion, type ValueAnimationTransition } from "framer-motion";
import InfoModal from "./InfoModal";

export default function PlayerScene() {
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const player = document.getElementById("player");
    const playerSprite = document.getElementById("playerSprite");

    if (!player) return;
    const playerImg = player.querySelector("img");
    if (!playerImg) return;
    const playerWidth = playerImg.width;
    const playerHeight = 200;
    let playerX = player.offsetLeft;
    let playerY = player.offsetTop;
    const playerSpeed = 5;

    let nextX = playerX;
    let nextY = playerY;

    const boundsElement = document.getElementById("bounds");
    if (!boundsElement) return;
    let bounds = boundsElement.getBoundingClientRect();

    function movePlayer() {
      if (!playerImg) return;
      if (nextX === playerX && nextY === playerY) {
        setIsMoving(false);
      }
      if (nextX !== playerX || nextY !== playerY) {
        setIsMoving(true);
      }
      if (nextX < playerX && nextX != playerX) {
        playerSprite!.style.transform = "scaleX(1)";
      } else if (nextX != playerX) {
        playerSprite!.style.transform = "scaleX(-1)";
      }

      if (nextX < bounds.left) nextX = bounds.left;
      if (nextX + playerWidth > bounds.right) nextX = bounds.right - playerWidth;
      if (nextY < bounds.top) nextY = bounds.top;
      if (nextY + playerHeight > bounds.bottom) nextY = bounds.bottom - playerHeight;

      const dx = nextX - playerX;
      const dy = nextY - playerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < playerSpeed) {
        playerX = nextX;
        playerY = nextY;
      } else {
        playerX += (dx / distance) * playerSpeed;
        playerY += (dy / distance) * playerSpeed;
      }
      player!.style.left = `${playerX}px`;
      player!.style.top = `${playerY}px`;
    }

    window.addEventListener("resize", () => {
      bounds = boundsElement.getBoundingClientRect();
    });
    document.addEventListener("mousedown", (e) => {
      console.log("move");
      nextX = e.clientX - playerWidth / 2;
      nextY = e.clientY - playerHeight / 2;
      console.log(player.style.left, player.style.top);
    });
    setInterval(movePlayer, 1000 / 60);
  }, []);
  const runningAnimationSpeed = 0.55;
  const animationTransition: ValueAnimationTransition = {
    duration: runningAnimationSpeed,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "linear"
  };

  return (
    <div>
      <InfoModal />
      <div id="player" className="absolute left-64 top-48 z-40">
        <div className="h-[10rem] w-[5rem] relative" id="playerSprite">
          <motion.img src="/assets/player/head.png" animate={isMoving ? { translateY: [0, -8] } : { translateY: [] }} transition={animationTransition} className="absolute left-[-3px]" alt="Devon Crebbin" />
          <motion.img src="/assets/player/body.png" animate={isMoving ? { translateY: [0, -10] } : { translateY: [] }} transition={animationTransition} className="absolute top-[2.5rem] z-40" alt="Devon Crebbin" />
          <motion.img src="/assets/player/leftArm.png" style={{ transformOrigin: "top right" }} animate={isMoving ? { rotateZ: [20, -45, -90, -120] } : { rotateZ: [] }} transition={animationTransition} className="absolute top-[2.8rem] right-16 z-20" alt="Devon Crebbin" />
          <motion.img src="/assets/player/rightArm.png" style={{ transformOrigin: "top left" }} animate={isMoving ? { rotateZ: [-20, 45, 90, 120] } : { rotateZ: [] }} transition={animationTransition} className="absolute top-[2.6rem] left-[1.8rem] z-50" alt="Devon Crebbin" />
          <motion.img src="/assets/player/leftLeg.png" style={{ transformOrigin: "top" }} animate={isMoving ? { rotateZ: [40, -0, -45, -75],  } : { rotateZ: [], }} transition={animationTransition} className="absolute top-[6rem] left-[-0.5rem] z-40" alt="Devon Crebbin" />
          <motion.img src="/assets/player/rightLeg.png" style={{ transformOrigin: "top" }} animate={isMoving ? { rotateZ: [-40, 0, 45, 75] } : { rotateZ: [] }} transition={animationTransition} className="absolute top-[6.2rem] left-[1.3rem] z-40" alt="Devon Crebbin" />
          <div className="w-[3rem] h-[1.5rem] bg-black/30 rounded-full blur-sm absolute z-30 top-44"></div>
        </div>
      </div>
    </div>
  );
}
