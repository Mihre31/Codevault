import { motion } from "framer-motion";

const floatingSquares = [
  {
    className: "left-[18%] top-[18%] h-3 w-3",
    delay: 0,
    duration: 24,
    x: ["0vw", "14vw", "31vw", "46vw", "58vw", "39vw", "21vw", "0vw"],
    y: ["0vh", "12vh", "7vh", "28vh", "19vh", "46vh", "36vh", "0vh"],
  },
  {
    className: "left-[72%] top-[14%] h-2.5 w-2.5",
    delay: 1.8,
    duration: 28,
    x: ["0vw", "-9vw", "-22vw", "-17vw", "-34vw", "-12vw", "0vw"],
    y: ["0vh", "14vh", "8vh", "35vh", "48vh", "26vh", "0vh"],
  },
  {
    className: "left-[11%] top-[70%] h-2 w-2",
    delay: 0.9,
    duration: 22,
    x: ["0vw", "12vw", "29vw", "41vw", "24vw", "8vw", "0vw"],
    y: ["0vh", "-11vh", "-4vh", "-24vh", "-39vh", "-21vh", "0vh"],
  },
  {
    className: "left-[86%] top-[68%] h-3.5 w-3.5",
    delay: 3.2,
    duration: 30,
    x: ["0vw", "-16vw", "-30vw", "-45vw", "-27vw", "-10vw", "0vw"],
    y: ["0vh", "-9vh", "-27vh", "-18vh", "-42vh", "-20vh", "0vh"],
  },
  {
    className: "left-[44%] top-[46%] h-2 w-2",
    delay: 2.4,
    duration: 26,
    x: ["0vw", "9vw", "-7vw", "18vw", "5vw", "-14vw", "0vw"],
    y: ["0vh", "13vh", "22vh", "35vh", "18vh", "8vh", "0vh"],
  },
];

export default function MotionBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.08)_1px,transparent_1px)] bg-[size:96px_96px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.5),transparent)] opacity-40 dark:bg-[linear-gradient(to_right,transparent,rgba(15,23,42,0.65),transparent)]" />
      {floatingSquares.map((square) => (
        <motion.span
          key={`${square.className}-${square.duration}`}
          className={`absolute rounded-[2px] border border-slate-500/40 bg-white/70 shadow-sm dark:border-slate-300/40 dark:bg-slate-200/70 ${square.className}`}
          animate={{
            x: square.x,
            y: square.y,
            scale: [1, 1.45, 0.85, 1.25, 1, 1.35, 0.9, 1],
            rotate: [0, 9, -7, 15, -10, 6, -4, 0],
            opacity: [0.16, 0.58, 0.38, 0.68, 0.5, 0.62, 0.34, 0.16],
          }}
          transition={{
            duration: square.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: square.delay,
          }}
        />
      ))}
    </div>
  );
}
