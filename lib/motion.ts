export const easeOut = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.35, ease: easeOut },
};

export const springSoft = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
};
