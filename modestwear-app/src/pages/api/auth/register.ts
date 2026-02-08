import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // TEMP fake user (replace later with DB)
  const user = {
    id: Date.now().toString(),
    name,
    email,
  };

  return res.status(200).json({
    user,
    access: "fake-access-token",
    refresh: "fake-refresh-token",
  });
}