import { useEffect, useRef, useState } from "react";
import { motion, type ValueAnimationTransition } from "framer-motion";

export default function PlayerScene() {
  const [isMoving, setIsMoving] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const audioRef = useRef(null);
  const typingSpeech = 43;

  const faceRef = useRef(null);

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
    let talkingInterval: number | undefined;
    let speakingInterval: number | undefined;

    function playAudio() {
      if (audioRef.current) {
        const audio = audioRef.current as HTMLAudioElement;
        audio.play();
        audio.currentTime = 0;
      }
    }

    function stopAudio() {
      const audio = audioRef.current as unknown as HTMLAudioElement;
      audio.currentTime = 0;
      audio.pause();
    }

    function clearTyping() {
      const speechContent = document.getElementById("speechContent");
      if (speechContent) speechContent.textContent = "";
      clearInterval(talkingInterval);
    }

    function showModal() {
      playAudio();
      startFakeTyping();
      startFakeSpeaking();
    }
    function hideModal() {
      clearTyping();
      stopFakeTyping();
      stopFakeSpeaking();
      stopAudio();
    }

    function infoButton() {
      setIsInfoOpen((prev) => {
        if (!prev) showModal();
        else hideModal();
        return !prev;
      });
    }

    function stopFakeSpeaking() {
      clearInterval(speakingInterval);
    }

    const text = "Hey how's it going. My name's Devon and I've been a software developer for the Australian Government for over 5 years - focusing on web development & innovation!";
    function startFakeSpeaking() {
      const face = faceRef.current as unknown as HTMLImageElement;
      let i = 0;
      speakingInterval = setInterval(() => {
        if (i % 2 == 0) {
          face.src = "/assets/player/head-speaking.png";
        } else {
          face.src = "/assets/player/head.png";
        }
        i++;
      }, 200);
    }

    function resetFace() {
      const face = faceRef.current as unknown as HTMLImageElement;
      face.src = "/assets/player/head.png";
    }

    function stopFakeTyping() {
      resetFace();
      clearInterval(talkingInterval);
    }

    function startFakeTyping() {
      let i = 0;
      const speechContent = document.getElementById("speechContent");
      if (!speechContent) return;
      talkingInterval = setInterval(() => {
        if (i < text.length) {
          speechContent.textContent += text.charAt(i);
          i++;
        } else {
          stopFakeTyping();
          stopFakeSpeaking();
        }
      }, typingSpeech);
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
    repeatType: "mirror",
    ease: "linear",
  };

  return (
    <div className="z-[10]">
      <div id="player" className="absolute top-72 left-72 md:left-[34rem] lg:left-72 lg:top-96 xl:left-[25rem] 2xl:left-[35rem] xl:top-96">
        <div className="-translate-x-12 lg:-translate-x-10 lg:-translate-y-10" hidden={!isInfoOpen}>
          <div className="w-72 h-32 bg-white text-black absolute z-20 p-3 -translate-x-[14em] -translate-y-[8em] rounded-3xl">
            <p id="speechContent"></p>
            <audio src="/assets/audio/intro.mp3" ref={audioRef}>
              <track kind="captions" />
            </audio>
          </div>
          <div className="absolute border-white -translate-x-10 z-20 rounded-b-lg  border-b-transparent border-b-[40px] border-r-[60px]"></div>
        </div>
        <div className="h-[10rem] w-[5rem] relative" id="playerSprite">
          <motion.img ref={faceRef} src="/assets/player/head.png" animate={isMoving ? { translateY: [0, -1, -2, -3, -4, -5, -6, -7] } : { translateY: [] }} transition={animationTransition} className="absolute left-[-3px]" alt="Head sprite" />
          <motion.img src="/assets/player/body.png" animate={isMoving ? { translateY: [0, -1, -2, -3, -4, -5, -6, -7] } : { translateY: [] }} transition={animationTransition} className="absolute top-[2.5rem] z-40" alt="Body sprite" />
          <motion.img src="/assets/player/leftArm.png" style={{ transformOrigin: "top right" }} animate={isMoving ? { rotateZ: [15, 0, -15, -30, -45, -60, -75, -90, -105] } : { rotateZ: [] }} transition={animationTransition} className="absolute top-[2.8rem] right-16 z-20 " alt="Left arm sprite" />
          <motion.img src="/assets/player/rightArm.png" style={{ transformOrigin: "top left" }} animate={isMoving ? { rotateZ: [-15, 0, 15, 30, 45, 60, 75, 90, 105] } : { rotateZ: [] }} transition={animationTransition} className="absolute top-[2.6rem] left-[1.8rem] z-50 " alt="Right arm sprite" />
          <motion.img src="/assets/player/leftLeg.png" style={{ transformOrigin: "top" }} animate={isMoving ? { rotateZ: [45, 30, 15, 0, -15, -30, -45, -60, -75] } : { rotateZ: [] }} transition={animationTransition} className="absolute top-[6rem] left-[-0.5rem] z-40 " alt="Left leg sprite" />
          <motion.img src="/assets/player/rightLeg.png" style={{ transformOrigin: "top" }} animate={isMoving ? { rotateZ: [-45, -30, -15, 0, 15, 30, 45, 60, 75] } : { rotateZ: [] }} transition={animationTransition} className="absolute top-[6.2rem] left-[1.3rem] z-40 " alt="Right leg sprite" />
          <div className="w-[3rem] h-[1.5rem] bg-black/30 rounded-full blur-sm absolute z-30 top-44"></div>
        </div>
      </div>
    </div>
  );
}