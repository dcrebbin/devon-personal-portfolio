import { useEffect, useState } from "react";
import { motion, type ValueAnimationTransition } from "framer-motion";

export default function PlayerScene() {
  const [isMoving, setIsMoving] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  useEffect(() => {
    //clean this up
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

    let initialWidth = window.innerWidth;

    const boundsElement = document.getElementById("bounds");
    if (!boundsElement) return;
    let bounds = boundsElement.getBoundingClientRect();

    function flipPlayer() {
      playerSprite!.style.transform = `scaleX(${nextX < playerX ? 1 : -1})`;
    }

    function updatePlayerPosition() {
      player!.style.left = `${playerX}px`;
      player!.style.top = `${playerY}px`;
    }

    function movePlayer() {
      const isMoving = nextX === playerX && nextY === playerY;
      setIsMoving(!isMoving);
      if (isMoving) return;
      flipPlayer();

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
      updatePlayerPosition();
    }

    function updateBounds() {
      let newWidth = window.innerWidth;
      if (newWidth !== initialWidth) {
        initialWidth = newWidth;
        bounds = boundsElement!.getBoundingClientRect();
      }
    }

    function infoButton() {
      setIsInfoOpen((prev) => !prev);
    }

    window.addEventListener("resize", () => {
      updateBounds();
    });
    document.addEventListener("mousedown", (e) => {
      const target = e.target as HTMLElement;

      if (target.closest("BUTTON") || target.closest("a")) {
        const button = target.closest("BUTTON");

        if (button?.id == "info") {
          infoButton();
        }

        return;
      }
      nextX = e.clientX - playerWidth / 2;
      nextY = e.clientY - playerHeight / 2;
    });
    setInterval(movePlayer, 1000 / 60);
  }, []);
  const runningAnimationSpeed = 0.55;
  const animationTransition: ValueAnimationTransition = {
    duration: runningAnimationSpeed,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "linear",
  };

  return (
    <div className="z-[10]">
      <div id="player" className="absolute left-64 top-48">
        <div className="-translate-x-10 -translate-y-10" hidden={!isInfoOpen}>
          <div className="w-72 h-32 bg-white text-black absolute z-20 p-3 -translate-x-[14em] -translate-y-[8em] rounded-3xl">
            <p>My name's Devon, I've been a software developer for the Australian Government with 5+ years - specializing in web development!</p>
          </div>
          <div className="absolute border-white -translate-x-10 z-20 rounded-b-lg  border-b-transparent border-b-[40px] border-r-[60px]"></div>
        </div>
        <div className="h-[10rem] w-[5rem] relative" id="playerSprite">
          <motion.img src="/assets/player/head.png" animate={isMoving ? { translateY: [0, -8] } : { translateY: [] }} transition={animationTransition} className="absolute left-[-3px]" alt="Devon Crebbin" />
          <motion.img src="/assets/player/body.png" animate={isMoving ? { translateY: [0, -10] } : { translateY: [] }} transition={animationTransition} className="absolute top-[2.5rem] z-40" alt="Devon Crebbin" />
          <motion.img src="/assets/player/leftArm.png" style={{ transformOrigin: "top right" }} animate={isMoving ? { rotateZ: [20, -45, -90, -120] } : { rotateZ: [] }} transition={animationTransition} className="absolute top-[2.8rem] right-16 z-20" alt="Devon Crebbin" />
          <motion.img src="/assets/player/rightArm.png" style={{ transformOrigin: "top left" }} animate={isMoving ? { rotateZ: [-20, 45, 90, 120] } : { rotateZ: [] }} transition={animationTransition} className="absolute top-[2.6rem] left-[1.8rem] z-50" alt="Devon Crebbin" />
          <motion.img src="/assets/player/leftLeg.png" style={{ transformOrigin: "top" }} animate={isMoving ? { rotateZ: [40, -0, -45, -75] } : { rotateZ: [] }} transition={animationTransition} className="absolute top-[6rem] left-[-0.5rem] z-40" alt="Devon Crebbin" />
          <motion.img src="/assets/player/rightLeg.png" style={{ transformOrigin: "top" }} animate={isMoving ? { rotateZ: [-40, 0, 45, 75] } : { rotateZ: [] }} transition={animationTransition} className="absolute top-[6.2rem] left-[1.3rem] z-40" alt="Devon Crebbin" />
          <div className="w-[3rem] h-[1.5rem] bg-black/30 rounded-full blur-sm absolute z-30 top-44"></div>
        </div>
      </div>
    </div>
  );
}
