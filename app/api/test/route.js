// app/api/test/route.js
import clientPromise from "@/lib/mongodb"; // Importing MongoDB connection logic

export async function GET(req) {
  try {
    // Connecting to MongoDB client
    const client = await clientPromise;
    
    // Specify the database (ensure the database name is correct)
    const db = client.db("sample_mflix");  // Replace with your actual database name
    
    // Specify the collection you want to query (ensure the collection name is correct)
    const collection = db.collection("users"); // Replace with your actual collection name
    
    // Fetching all documents from the collection
    const data = await collection.find().toArray();
    
    console.log("Data Retrieved: ", data); // Log the data for troubleshooting
    
    // Returning the retrieved data in the response
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error: ", error); // Log the error for debugging
    
    // Returning an error message in the response
    return new Response(JSON.stringify({ message: "Error connecting to MongoDB" }), { status: 500 });
  }
}
