const express = require('express');
const { Log } = require('./utils/logger'); 
require('dotenv').config();

const app = express();
app.use(express.json());

const connectDB = async () => {
    try {
        await Log("backend", "info", "db", "MongoDB connected successfully."); 
    } catch (error) {
        await Log("backend", "fatal", "db", "Critical error: MongoDB failed."); 
    }
};

app.post('/api/users', async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            await Log("backend", "warn", "handler", "Request received without username."); 
            return res.status(400).json({ error: "Username is required" });
        }

        await Log("backend", "info", "route", `User created: ${username}`);
        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        await Log("backend", "error", "handler", "Internal server error occurred."); 
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    
    await Log("backend", "info", "config", "Express server has started."); 
    
    connectDB();
});