export async function addToWishlist(item: {
  id: string;
  name: string;
  image?: string;
}) {
  const res = await fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

  if (!res.ok) {
    throw new Error("Failed to add to wishlist");
  }

  return res.json();
}

export async function getWishlist() {
  const res = await fetch("/api/wishlist");
  return res.json();
}