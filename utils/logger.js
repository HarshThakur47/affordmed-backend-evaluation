const axios = require('axios');
require('dotenv').config();

const API_URL = "http://20.207.122.201/evaluation-service/logs";

const Log = async (stack, level, pkg, message) => {
    try {
        const safeMessage = message.length > 48 ? message.substring(0, 48) : message;

        const bodyData = {
            stack: stack.toLowerCase(),
            level: level.toLowerCase(),
            package: pkg.toLowerCase(),
            message: safeMessage
        };

        const response = await axios.post(API_URL, bodyData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.EVAL_ACCESS_TOKEN}`
            }
        });

        console.log(`[Eval Server Logged] - ${response.data.message || 'Success'}`);

    } catch (error) {
        if (error.response && error.response.data) {
            console.error("❌ 400 Validation Error from Server:", error.response.data);
        } else {
            console.error("Network/Server Error while sending log:", error.message);
        }
    }
};

module.exports = { Log };