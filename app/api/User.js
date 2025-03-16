import connectToDatabase from "../../lib/mongodb";
import User from "../../models/User";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const { name, email, image } = req.body;
      let user = await User.findOne({ email });

      if (!user) {
        user = new User({ name, email, image });
        await user.save();
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Error saving user" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
