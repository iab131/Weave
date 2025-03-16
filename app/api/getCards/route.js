import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const client = await clientPromise;
  const db = client.db("your_db");
  
  const cards = await db.collection("cards").find({ userId: session.user.id }).toArray();
  return new Response(JSON.stringify(cards), { status: 200 });
}
