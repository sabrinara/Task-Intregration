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
    // console.log('Request body:', req.body);
    const { username, email } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({ username, email });
        await user.save();  
        // console.log('User saved:', user);
      }
  
      const access_token = jwt.sign({ username, email }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.EXPIRES_IN,
      });
  
      // Send the response with the token
      res.json({ access_token });
      // console.log('Login successful');
  
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
