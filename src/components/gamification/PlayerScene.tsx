import { useEffect, useRef, useState } from "react";
import { motion, type ValueAnimationTransition } from "framer-motion";
import { INTRODUCTION_TEXT, PLAYER_SCENE_CONFIG } from "../../constants";

export default function PlayerScene() {
  const [isMoving, setIsMoving] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const audioRef = useRef(null);

  let currentPlayerDirection = {
    x: 0,
    y: 0,
  };

  let nextPlayerDirection = {
    x: 0,
    y: 0,
  };

  let bounds = { left: 0, top: 0, right: 0, bottom: 0 };
  let initialWidth = 0;
  let player: HTMLElement | null = null;
  let playerSprite: HTMLElement | null = null;
  let playerWidth = 0;
  let playerHeight = 0;
  let boundsElement: HTMLElement | null = null;
  let talkingInterval: number | undefined;
  let speakingInterval: number | undefined;

  const faceRef = useRef(null);

  function flipPlayer() {
    playerSprite!.style.transform = `scaleX(${nextPlayerDirection.x < currentPlayerDirection.x ? 1 : -1})`;
  }

  function updateNextDirections() {
    if (nextPlayerDirection.x < bounds.left) nextPlayerDirection.x = bounds.left;
    if (nextPlayerDirection.x + playerWidth > bounds.right) nextPlayerDirection.x = bounds.right - playerWidth;
    if (nextPlayerDirection.y < bounds.top) nextPlayerDirection.y = bounds.top;
    if (nextPlayerDirection.y + playerHeight > bounds.bottom) nextPlayerDirection.y = bounds.bottom - playerHeight;
  }

  function movePlayer() {
    const isMoving = nextPlayerDirection.x === currentPlayerDirection.x && nextPlayerDirection.y === currentPlayerDirection.y;
    setIsMoving(!isMoving);
    if (isMoving) return;
    flipPlayer();
    updateNextDirections();

    const directionX = nextPlayerDirection.x - currentPlayerDirection.x;
    const directionY = nextPlayerDirection.y - currentPlayerDirection.y;
    const distance = Math.sqrt(directionX * directionX + directionY * directionY);
    updatePlayerPosition(distance, directionX, directionY);
  }

  function updatePlayerPosition(distance: number, directionX: number, directionY: number) {
    if (distance < PLAYER_SCENE_CONFIG.playerSpeed) {
      currentPlayerDirection.x = nextPlayerDirection.x;
      currentPlayerDirection.y = nextPlayerDirection.y;
    } else {
      currentPlayerDirection.x += (directionX / distance) * PLAYER_SCENE_CONFIG.playerSpeed;
      currentPlayerDirection.y += (directionY / distance) * PLAYER_SCENE_CONFIG.playerSpeed;
    }

    player!.style.left = `${currentPlayerDirection.x}px`;
    player!.style.top = `${currentPlayerDirection.y}px`;
  }

  function updateBounds() {
    let newWidth = window.innerWidth;
    if (newWidth !== initialWidth) {
      initialWidth = newWidth;
      bounds = boundsElement!.getBoundingClientRect();
    }
  }

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

  function resetFace() {
    const face = faceRef.current as unknown as HTMLImageElement;
    face.src = PLAYER_SCENE_CONFIG.mouthClosedSprite;
  }

  function stopFakeSpeaking() {
    clearInterval(speakingInterval);
  }

  function startFakeSpeaking() {
    const face = faceRef.current as unknown as HTMLImageElement;
    let i = 0;
    speakingInterval = setInterval(() => {
      if (i % 2 == 0) {
        face.src = PLAYER_SCENE_CONFIG.mouthOpenSprite;
      } else {
        face.src = PLAYER_SCENE_CONFIG.mouthClosedSprite;
      }
      i++;
    }, PLAYER_SCENE_CONFIG.speechSpeed);
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
      if (i < INTRODUCTION_TEXT.length) {
        speechContent.textContent += INTRODUCTION_TEXT.charAt(i);
        i++;
      } else {
        stopFakeTyping();
        stopFakeSpeaking();
      }
    }, PLAYER_SCENE_CONFIG.typingSpeech);
  }

  function assignVariables() {
    player = document.getElementById("player");
    playerSprite = document.getElementById("playerSprite");

    if (!player) return;
    const playerImg = player.querySelector("img");
    if (!playerImg) return;
    initialWidth = window.innerWidth;
    playerWidth = playerImg.width;
    playerHeight = playerImg.height;
    currentPlayerDirection.x = player.offsetLeft;
    currentPlayerDirection.y = player.offsetTop;
    nextPlayerDirection.x = currentPlayerDirection.x;
    nextPlayerDirection.y = currentPlayerDirection.y;
    boundsElement = document.getElementById("bounds");
    if (!boundsElement) return;
    bounds = boundsElement.getBoundingClientRect();
  }

  function addEventListeners() {
    window.addEventListener("resize", () => {
      updateBounds();
    });
    document.addEventListener("mousedown", (e) => {
      const target = e.target as HTMLElement;

      if (target.closest("BUTTON") || target.closest("a") || target.closest("SELECT") || target.closest("OPTION")) {
        const button = target.closest("BUTTON");

        if (button?.id == "info") {
          infoButton();
        }

        return;
      }
      nextPlayerDirection.x = e.clientX - playerWidth / 2;
      nextPlayerDirection.y = e.clientY - playerHeight / 2;
    });
  }

  function init() {
    assignVariables();
    addEventListeners();
  }

  useEffect(() => {
    init();
    setInterval(movePlayer, 1000 / 60);
  }, []);
  const animationTransition: ValueAnimationTransition = {
    duration: PLAYER_SCENE_CONFIG.runningAnimationSpeed,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "linear",
  };

  return (
    <div className="z-[10]">
      <div id="player" className="absolute top-[22rem] left-[19rem] md:left-[34rem] lg:left-72 lg:top-96 xl:left-[25rem] 2xl:left-[35rem] xl:top-96">
        <div className="-translate-x-12 lg:-translate-x-10 lg:-translate-y-10" hidden={!isInfoOpen}>
          <div className="w-72 h-32 bg-white introductionText-black absolute z-20 p-3 -translate-x-[14em] -translate-y-[8em] rounded-3xl">
            <p id="speechContent"></p>
            <audio src="/assets/audio/intro.mp3" ref={audioRef}>
              <track kind="captions" />
            </audio>
          </div>
          <div className="absolute border-white -translate-x-10 z-20 rounded-b-lg  border-b-transparent border-b-[40px] border-r-[60px]"></div>
        </div>
        <div className="h-[10rem] w-[5rem] relative" id="playerSprite">
          <motion.img ref={faceRef} src="/assets/player/head.png" animate={isMoving ? { translateY: [0, -1, -2, -3, -4, -5, -6, -7] } : { translateY: [] }} transition={animationTransition} className="absolute left-[-3px]" alt="Head sprite" />
          <motion.img src="/assets/player/body.png" animate={isMoving ? { translateY: [0, -1, -2, -3, -4, -5, -6, -7] } : { translateY: [] }} transition={animationTransition} className="absolute top-[2.5rem] z-40" alt="BodirectionY sprite" />
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
