import rateLimit from "express-rate-limit";

const createLimiter = ({ max, message, windowMinutes }) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
  });

export const apiLimiter = createLimiter({
  windowMinutes: 15,
  max: 300,
  message: "Too many requests. Please slow down and try again soon.",
});

export const authLimiter = createLimiter({
  windowMinutes: 15,
  max: 20,
  message: "Too many auth attempts. Please try again later.",
});

export const passwordResetLimiter = createLimiter({
  windowMinutes: 15,
  max: 5,
  message: "Too many password reset attempts. Please try again later.",
});
