import type { NextApiRequest, NextApiResponse } from "next";

let wishlist: any[] = []; // ⚠️ mock storage (resets on refresh)

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const item = req.body;

    if (!item?.id) {
      return res.status(400).json({ message: "Invalid item" });
    }

    const exists = wishlist.find((i) => i.id === item.id);

    if (!exists) {
      wishlist.push(item);
    }

    return res.status(200).json(wishlist);
  }

  if (req.method === "GET") {
    return res.status(200).json(wishlist);
  }

  return res.status(405).end();
}