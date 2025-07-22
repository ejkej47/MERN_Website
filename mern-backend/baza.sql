

CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  image TEXT,
  googleId TEXT UNIQUE,
  refreshToken TEXT
);


CREATE TABLE "Course" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL, 
  imageUrl TEXT,
  price INT DEFAULT 0
);

-- Povezivanje korisnika i kurseva (many-to-many)
CREATE TABLE "UserCourseAccess" (
  "userId" INT REFERENCES "User"(id) ON DELETE CASCADE,
  "courseId" INT REFERENCES "Course"(id) ON DELETE CASCADE,
  PRIMARY KEY ("userId", "courseId")
);

-- Tokeni za reset lozinke
CREATE TABLE "PasswordResetToken" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);


INSERT INTO "Course" (title, description, slug, imageUrl, price) VALUES
('React for Beginners', 'Learn the fundamentals of React including components, state, and props.', 'react-for-beginners', '/images/react.png', 0),
('Advanced Node.js', 'Deep dive into Node.js with event loop, streams, and clustering.', 'advanced-nodejs', '/images/node.png', 49),
('Fullstack with PostgreSQL', 'Build fullstack apps with Express, PostgreSQL and React.', 'fullstack-postgres', '/images/postgres.png', 59);

select * from "Course";

