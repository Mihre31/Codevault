import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import { ENV } from "./env.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase().trim();

        if (!email) {
          return done(null, false, { message: "Google account has no email" });
        }

        const googleName = [
          profile.name?.givenName,
          profile.name?.familyName,
        ]
          .filter(Boolean)
          .join(" ")
          .trim();
        const fullName =
          profile.displayName?.trim() ||
          googleName ||
          email.split("@")[0] ||
          "Google User";
        const profilePic = profile.photos?.[0]?.value || "";

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (user) {
          if (!user.fullName) {
            user.fullName = fullName;
          }

          if (!user.googleId) {
            user.googleId = profile.id;
          }

          user.profilePic = user.profilePic || profilePic;
          await user.save();

          return done(null, user);
        }

        user = await User.create({
          fullName,
          email,
          googleId: profile.id,
          profilePic,
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
