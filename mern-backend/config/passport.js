const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findFirst({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await prisma.user.findUnique({
            where: { email: profile.emails[0].value },
          });

          if (user) {
            user = await prisma.user.update({
              where: { email: profile.emails[0].value },
              data: {
                googleId: profile.id,
                image: profile.photos?.[0]?.value || "",
              },
            });
          } else {
            user = await prisma.user.create({
              data: {
                email: profile.emails[0].value,
                googleId: profile.id,
                image: profile.photos?.[0]?.value || "",
                password: "",
              },
            });
          }
        }

        return done(null, user);
      } catch (err) {
        console.error("Passport GoogleStrategy error:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
