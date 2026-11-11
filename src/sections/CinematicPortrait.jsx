
import { useRef } from "react";
import {
  m as motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

import portraitSide from "../assets/portrait-side.png";
import portraitThreeQuarter from "../assets/portrait-three-quarter.png";
import portraitFront from "../assets/portrait-front.png";

import "./CinematicPortrait.css";

export default function CinematicPortrait() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Crossfade from side to three-quarter view.
  const sideOpacity = useTransform(
    scrollYProgress,
    [0, 0.22, 0.48],
    [1, 1, 0]
  );

  // Keep the middle view visible before the final turn.
  const middleOpacity = useTransform(
    scrollYProgress,
    [0.22, 0.48, 0.58, 0.85],
    [0, 1, 1, 0]
  );

  // Reveal the front-facing portrait.
  const frontOpacity = useTransform(
    scrollYProgress,
    [0.58, 0.85, 1],
    [0, 1, 1]
  );

  const portraitScale = useTransform(
  scrollYProgress,
  [0, 1],
  [1, 1.22]
);

const portraitX = useTransform(
  scrollYProgress,
  [0, 1],
  ["8%", "-12%"]
);

  const glowX = useTransform(
    scrollYProgress,
    [0, 1],
    ["-3%", "4%"]
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      className="cinematic-portrait-section"
      aria-label="Introduction"
    >
      <div className="cinematic-sticky">
        <motion.div
          className="cinematic-background"
          aria-hidden="true"
          style={{
            x: reduceMotion ? 0 : glowX,
          }}
        />

        <motion.div
          className="cinematic-images"
          style={{
            scale: reduceMotion ? 1 : portraitScale,
            x: reduceMotion ? 0 : portraitX,
          }}
        >
          <motion.img
            src={portraitSide}
            alt=""
            aria-hidden="true"
            style={{
              opacity: reduceMotion ? 0 : sideOpacity,
            }}
          />

          <motion.img
            src={portraitThreeQuarter}
            alt=""
            aria-hidden="true"
            style={{
              opacity: reduceMotion ? 0 : middleOpacity,
            }}
          />

          <motion.img
            src={portraitFront}
            alt="Cinematic portrait of Sameer Singh Rajput"
            style={{
              opacity: reduceMotion ? 1 : frontOpacity,
            }}
          />
        </motion.div>

        <div
          className="cinematic-overlay"
          aria-hidden="true"
        />

        <div className="cinematic-text">
          <p className="cinematic-eyebrow eyebrow">
            JUNIOR WEB DEVELOPER · UI ENTHUSIAST
          </p>

          <h1>
            Hi, I'm <span>Sameer.</span>
          </h1>

          <p className="cinematic-description">
            I build responsive interfaces with React, JavaScript, and CSS, and share what I’m learning through practical projects.
          </p>

          <div className="cinematic-buttons">
            <a href="#projects" className="button button-primary">
              View Projects
            </a>

            <a href="#contact" className="button button-secondary">
              Contact Me
            </a>
          </div>
        </div>

        <div
          className="cinematic-scroll-hint"
          aria-hidden="true"
        >
          SCROLL TO EXPLORE
          <span />
        </div>
      </div>
    </section>
  );
}
