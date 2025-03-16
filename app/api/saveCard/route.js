import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { firstName, lastName, company, handle, comments } = await req.json();
  const client = await clientPromise;
  const db = client.db("your_db");
  
  await db.collection("cards").insertOne({
    userId: session.user.id,
    firstName,
    lastName,
    company,
    handle,
    comments,
    createdAt: new Date(),
  });

  return new Response("Card saved", { status: 200 });
}
