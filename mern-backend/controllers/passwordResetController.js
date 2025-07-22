const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

exports.requestReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "Korisnik nije pronađen." });

    const code = crypto.randomBytes(3).toString("hex").toUpperCase(); // primer: '3F5A9C'
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minuta

    await prisma.passwordResetToken.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    await transporter.sendMail({
      from: `"Learnify" <${EMAIL_USER}>`,
      to: email,
      subject: "Zahtev za resetovanje lozinke",
      html: `<p>Vaš kod za resetovanje lozinke je:</p><h2>${code}</h2><p>Važi 15 minuta.</p>`,
    });

    res.json({ message: "Kod je poslat na email." });
  } catch (err) {
    res.status(500).json({ message: "Greška pri slanju emaila." });
  }
};

exports.verifyResetCode = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const token = await prisma.passwordResetToken.findFirst({
      where: {
        email,
        code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!token) return res.status(400).json({ message: "Nevažeći ili istekao kod." });

    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    res.json({ message: "Lozinka uspešno resetovana." });
  } catch (err) {
    res.status(500).json({ message: "Greška na serveru." });
  }
};
