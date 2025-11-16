import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import FlappyBird from "./FlappyBird";
import Footer from "./Footer";
import Background from "./Background";
import useGame from "../hooks/useGame";
import Pipes from "./Pipes";
import useElementSize from "../hooks/useElementSize";
import _ from "lodash";
export default function Game() {
  const {
    handleWindowClick,
    startGame,
    isReady,
    rounds,
    audioVolume,
    audioMuted,
    isGameOver,
  } = useGame();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioModiRef = useRef<HTMLAudioElement | null>(null);
  const [ref, window] = useElementSize();
  useEffect(() => {
    if (window.width > 0 && window.height > 0) {
      startGame(window);
    }
  }, [window, ref]);

  // sync audio element with context volume/muted
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    try {
      el.volume = audioVolume;
    } catch (e) {
      /* ignore */
    }
    el.muted = audioMuted;
  }, [audioVolume, audioMuted]);

  // When a collision/game over occurs, stop the background loop and play the Modi audio once.
  useEffect(() => {
    if (!isGameOver) return;
    const bg = audioRef.current;
    const mod = audioModiRef.current;
    if (bg) {
      try {
        bg.pause();
        bg.currentTime = 0;
      } catch (e) {
        /* ignore */
      }
    }
    if (mod) {
      try {
        mod.volume = audioVolume;
        mod.muted = audioMuted;
        // ensure it plays once
        mod.currentTime = 0;
        mod.play().catch(() => {});
      } catch (e) {
        /* ignore */
      }
    }
  }, [isGameOver]);

  return (
    <motion.main
      layout
      className="m-auto overflow-hidden flex flex-col max-w-[480px] border-8 border-zinc-200 rounded-xl bg-[#ded895]   relative max-h-[800px] w-full h-full"
    >
      <Background />
      {/* Background music: passiveSong.mp3 placed in public/ will be served at /passiveSong.mp3 */}
      <audio ref={audioRef} src="/passiveSong.mp3" loop preload="auto" />
  <audio ref={audioModiRef} src="/modi-ji-bkl.mp3" preload="auto" />

      <motion.div
        ref={ref} 
        key={_.last(rounds)?.key || "initial"}
        onTap={() => {
          // Start the game action
          handleWindowClick();
          // Try to play the background music on the first user interaction.
          // Browsers require user interaction before audio playback in many cases.
          if (audioRef.current) {
            // set a reasonable default volume
            try {
              audioRef.current.volume = 0.5;
            } catch (e) {
              /* ignore */
            }
            audioRef.current.play().catch(() => {
              // play() may reject if autoplay isn't allowed; we silently ignore
            });
          }
        }}
        className="h-[calc(100%-7rem)] z-10 flex relative overflow-hidden cursor-pointer"
      >
        {isReady && (
          <>
            {/* Election result image in the top-left corner of the play area */}
            <img
              src="/electionresult.png"
              alt="election-result"
              className="absolute top-2 left-2 w-48 h-48 z-20 pointer-events-none"
            />
            <Pipes />
            <FlappyBird />
          </>
        )}
      </motion.div>
      <Footer />
    </motion.main>
  );
}
