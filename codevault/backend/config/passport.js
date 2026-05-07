import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

dotenv.config();

const callbackURL =
  process.env.GOOGLE_CALLBACK_URL ||
  "http://localhost:5000/api/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(null, false, { message: "Google account has no email" });
        }

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            user.profilePic = user.profilePic || profile.photos?.[0]?.value || "";
            await user.save();
          }

          return done(null, user);
        }

        user = await User.create({
          fullName: profile.displayName || email.split("@")[0],
          email,
          googleId: profile.id,
          profilePic: profile.photos?.[0]?.value || "",
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
