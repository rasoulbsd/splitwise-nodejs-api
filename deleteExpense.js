// Load environment variables from .env file
require('dotenv').config();

// Parse command-line arguments
const args = process.argv.slice(2);
const helpFlag = args.includes('--help');

// Help message
if (helpFlag) {
    console.log(`
Usage:
    node deleteExpense.js [options]

Options:
    --id <expense_id>      The ID of the expense to delete.
    --help                 Show this help message.

Examples:
    node deleteExpense.js --id 3503931874
`);
    process.exit(0);
}

// Extract command-line arguments
const getArgument = (argName) => {
    const index = args.indexOf(argName);
    return index !== -1 && args[index + 1] ? args[index + 1] : null;
};

// Get required argument
const expenseId = getArgument('--id');

// Check if required argument is provided
if (!expenseId) {
    console.error(`
Error: Missing required argument.

Usage:
    node deleteExpense.js --id <expense_id>

Use --help for more information.
`);
    process.exit(1);
}

// Main function
(async () => {
    try {
        // Define the API endpoint
        const url = `https://secure.splitwise.com/api/v3.0/delete_expense/${expenseId}`;

        // Define the headers
        const headers = {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "X-CSRF-Token": process.env.X_CSRF_TOKEN,
            "Cookie": `user_credentials=${process.env.USER_CREDENTIALS}; swdid=${process.env.SWDID}; _splitwise_session=${process.env.SPLITWISE_SESSION}`,
            "X-Requested-With": "XMLHttpRequest",
            "Content-Length": "0",
        };

        // Perform the DELETE request
        const response = await fetch(url, {
            method: "POST", // Splitwise uses POST for delete operations
            headers: headers,
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if the response has an 'errors' field
        if ('errors' in data) {
            console.log(`Expense with ID ${expenseId} deleted successfully:`, data);
        } else {
            console.log(`Expense with ID ${expenseId} might have already been deleted or the ID is incorrect.`);
        }
    } catch (error) {
        console.error(`Error deleting expense with ID ${expenseId}:`, error);
    }
})();
