import type { NextApiRequest, NextApiResponse } from "next";

export default async function Login(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  if (email === "user@example.com" && password === "SecurePass123!") {
    return res.status(200).json({
      user: { id: 1, email },
      token: "fake-jwt-token",
    });
  }

  return res.status(401).json({ message: "Invalid credentials" });
}