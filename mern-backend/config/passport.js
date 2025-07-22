const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("../db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const image = profile.photos?.[0]?.value || "";

        // check if user with googleId exists
        let result = await pool.query('SELECT * FROM "User" WHERE "googleId" = $1', [googleId]);
        let user = result.rows[0];

        if (!user) {
          // if not, check if user with email exists
          result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
          user = result.rows[0];

          if (user) {
            // update existing user with googleId and image
            result = await pool.query(
              'UPDATE "User" SET "googleId" = $1, image = $2 WHERE email = $3 RETURNING *',
              [googleId, image, email]
            );
            user = result.rows[0];
          } else {
            // create new user
            result = await pool.query(
              'INSERT INTO "User" (email, "googleId", image, password) VALUES ($1, $2, $3, $4) RETURNING *',
              [email, googleId, image, ""]
            );
            user = result.rows[0];
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
    const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [id]);
    const user = result.rows[0];
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
