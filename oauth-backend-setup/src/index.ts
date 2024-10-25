import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './models/User';



dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(express.json());



mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


  app.post('/login', async (req: Request, res: Response) => {
    const { username, email, image, jira_instance_url } = req.body; // Include jira_instance_url
    
    try {
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({ username, email, image, jira_instance_url }); // Save the URL when creating a new user
        await user.save();  
      } else {
        // Optionally update the existing user's Jira instance URL
        user.jira_instance_url = jira_instance_url; // Update the user's Jira URL
        await user.save();
      }
    
      const access_token = jwt.sign({ username, email, image }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.EXPIRES_IN,
      });
    
      // Send the response with the token
      res.json({ access_token });
    
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  

// Test route
app.get('/', (req: Request, res: Response) => {
  const serverStatus = {
    message: 'Server is running smoothly',
    timestamp: new Date(),
  };
  res.json(serverStatus);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
