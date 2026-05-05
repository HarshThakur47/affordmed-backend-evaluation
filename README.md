# Campus Vehicle Maintenance Scheduler - Backend Track

## Overview
This project implements a microservice for a logistics company to optimize daily vehicle maintenance schedules. Given a daily budget of mechanic hours, the system selects a subset of vehicles for service that maximizes the total operational impact score.

## Technical Implementation
*   **Algorithm**: Implemented a **0/1 Knapsack Optimization** using Dynamic Programming to ensure the highest possible impact within the hour constraints.
*   **Middleware**: Integrated a custom **Logging Middleware** that sends real-time execution logs to the Affordmed evaluation server.
*   **Security**: Used environment variables for sensitive authentication tokens and ensured they are excluded from version control.

## Project Structure
*   `utils/logger.js`: Reusable logging middleware integrated with the evaluation server.
*   `vehicle_scheduling/index.js`: The core scheduling algorithm that fetches data from protected APIs and processes results.
*   `vehicle_scheduling/*.png`: Output screenshots proving the successful execution and result calculation.

## How to Run
1. Clone the repository.
2. Run `npm install` in both the root and `vehicle_scheduling` directories.
3. Configure your `.env` file with a valid `EVAL_ACCESS_TOKEN`.
4. Run the scheduler: `node vehicle_scheduling/index.js`