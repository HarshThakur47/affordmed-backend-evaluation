const axios = require('axios');
const { Log } = require('../utils/logger');
require('dotenv').config({ path: '../.env' }); 

const API_BASE_URL = "http://20.207.122.201/evaluation-service";
const TOKEN = process.env.EVAL_ACCESS_TOKEN;

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${TOKEN}`
};

const optimizeSchedule = (capacity, vehicles) => {
    const n = vehicles.length;
    const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        const weight = vehicles[i - 1].Duration;
        const value = vehicles[i - 1].Impact;

        for (let w = 1; w <= capacity; w++) {
            if (weight <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weight] + value);
            } else {
                dp[i][w] = dp[i - 1][w]; 
            }
        }
    }

    let res = dp[n][capacity];
    let w = capacity;
    const chosenTasks = [];

    for (let i = n; i > 0 && res > 0; i--) {
        if (res === dp[i - 1][w]) {
            continue;
        } else {
            chosenTasks.push(vehicles[i - 1].TaskID);
            res -= vehicles[i - 1].Impact;
            w -= vehicles[i - 1].Duration;
        }
    }

    return { maxImpact: dp[n][capacity], scheduledTasks: chosenTasks };
};

// --- MAIN EXECUTION ---
const runScheduler = async () => {
    try {
        await Log("backend", "info", "service", "Starting vehicle scheduling process.");

        const depotsRes = await axios.get(`${API_BASE_URL}/depots`, { headers });
        const depots = depotsRes.data.depots;
        await Log("backend", "info", "service", `Successfully fetched ${depots.length} depots.`);

        const vehiclesRes = await axios.get(`${API_BASE_URL}/vehicles`, { headers });
        const vehicles = vehiclesRes.data.vehicles;
        await Log("backend", "info", "service", `Successfully fetched ${vehicles.length} vehicle tasks.`);

        console.log("\n================ SCHEDULING RESULTS ================\n");

        for (const depot of depots) {
            const capacity = depot.MechanicHours;
            const result = optimizeSchedule(capacity, vehicles);

            console.log(`Depot ID: ${depot.ID}`);
            console.log(`Available Hours: ${capacity}`);
            console.log(`Max Impact Achieved: ${result.maxImpact}`);
            console.log(`Total Tasks Scheduled: ${result.scheduledTasks.length}`);
            console.log(`Task IDs:`, result.scheduledTasks);
            console.log("--------------------------------------------------\n");

            await Log("backend", "info", "service", `Optimized schedule for Depot ${depot.ID}.`);
        }

        await Log("backend", "info", "service", "Scheduling completed successfully.");

    } catch (error) {
        console.error("Error executing scheduler:", error.message);
        await Log("backend", "error", "service", "Critical failure in scheduler execution.");
    }
};

runScheduler();