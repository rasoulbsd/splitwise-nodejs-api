// Load environment variables from .env file
require('dotenv').config();

// Define the API endpoint
const url = "https://secure.splitwise.com/api/v3.0/get_expenses";

// Parse command-line arguments
const args = process.argv.slice(2);
const helpFlag = args.includes('--help');

// Help message
if (helpFlag) {
    console.log(`
Usage:
    node fetchExpenses.js [options]

Options:
    --friend_id <id>       The Splitwise friend ID to fetch expenses for.
    --limit <number>       The maximum number of expenses to fetch.
    --help                 Show this help message.

Examples:
    node fetchExpenses.js --friend_id 22088182 --limit 25
`);
    process.exit(0);
}

// Extract command-line arguments
const getArgument = (argName) => {
    const index = args.indexOf(argName);
    return index !== -1 && args[index + 1] ? args[index + 1] : null;
};

// Get required arguments
const friendId = getArgument('--friend_id');
const limit = getArgument('--limit');

// Check if required arguments are provided
if (!friendId || !limit) {
    console.error(`
Error: Missing required arguments.

Usage:
    node fetchExpenses.js --friend_id <id> --limit <number>

Use --help for more information.
`);
    process.exit(1);
}

// Main function
(async () => {
    try {
        // Define the query parameters
        const params = new URLSearchParams({
            visible: true,
            order: "date",
            friend_id: friendId,
            limit: limit,
            group_id: 0,
        });

        // Define the headers
        const headers = {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "X-CSRF-Token": process.env.X_CSRF_TOKEN,
            "Cookie": `user_credentials=${process.env.USER_CREDENTIALS}; swdid=${process.env.SWDID}; _splitwise_session=${process.env.SPLITWISE_SESSION}`,
            "X-Requested-With": "XMLHttpRequest",
        };

        // Perform the fetch request
        const response = await fetch(`${url}?${params.toString()}`, {
            method: "GET",
            headers: headers,
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse and log the JSON data
        const data = await response.json();
        console.log("Response data:", data);
    } catch (error) {
        console.error("Error fetching expenses:", error);
    }
})();
