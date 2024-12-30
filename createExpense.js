// Load environment variables from .env file
require('dotenv').config();

// Parse command-line arguments
const args = process.argv.slice(2);
const helpFlag = args.includes('--help');

// Help message
if (helpFlag) {
    console.log(`
Usage:
    node createExpense.js [options]

Options:
    --cost <amount>                The total cost of the expense.
    --currency_code <currency>     The currency code (e.g., USD, CAD).
    --group_id <group_id>          The group ID (use 0 for personal expenses).
    --user_id1 <id>                The first user's ID (payer).
    --paid_share1 <amount>         The amount paid by the first user.
    --owed_share1 <amount>         The amount owed by the first user.
    --user_id2 <id>                The second user's ID (splitter).
    --paid_share2 <amount>         The amount paid by the second user.
    --owed_share2 <amount>         The amount owed by the second user.
    --description <text>           A description of the expense.
    --category_id <id>             The category ID (optional).
    --date <date_string>           The date of the expense (optional).
    --help                         Show this help message.

Examples:
    node createExpense.js --cost 22 --currency_code CAD --group_id 0 --user_id1 16073027 --paid_share1 22.00 --owed_share1 11.00 --user_id2 22088182 --paid_share2 0.00 --owed_share2 11.00 --description "Test" --category_id 18 --date "2024-12-29"
`);
    process.exit(0);
}

// Extract command-line arguments
const getArgument = (argName) => {
    const index = args.indexOf(argName);
    return index !== -1 && args[index + 1] ? args[index + 1] : null;
};

// Extract required arguments
const cost = getArgument('--cost');
const currencyCode = getArgument('--currency_code');
const groupId = getArgument('--group_id');
const userId1 = getArgument('--user_id1');
const paidShare1 = getArgument('--paid_share1');
const owedShare1 = getArgument('--owed_share1');
const userId2 = getArgument('--user_id2');
const paidShare2 = getArgument('--paid_share2');
const owedShare2 = getArgument('--owed_share2');
const description = getArgument('--description');

// Optional arguments
const categoryId = getArgument('--category_id') || null;
const date = getArgument('--date') || new Date().toISOString().split('T')[0];

// Check for missing required arguments
if (!cost || !currencyCode || !groupId || !userId1 || !paidShare1 || !owedShare1 || !userId2 || !paidShare2 || !owedShare2 || !description) {
    console.error(`
Error: Missing required arguments.

Usage:
    node createExpense.js --cost <amount> --currency_code <currency> --group_id <group_id> --user_id1 <id> --paid_share1 <amount> --owed_share1 <amount> --user_id2 <id> --paid_share2 <amount> --owed_share2 <amount> --description <text>

Use --help for more information.
`);
    process.exit(1);
}

// Main function
(async () => {
    try {
        // Define the API endpoint
        const url = `https://secure.splitwise.com/api/v3.0/create_expense`;

        // Prepare the payload
        const payload = new URLSearchParams({
            cost: cost,
            currency_code: currencyCode,
            group_id: groupId,
            description: description,
            creation_method: 'equal',
            date: date,
            [`users__0__user_id`]: userId1,
            [`users__0__paid_share`]: paidShare1,
            [`users__0__owed_share`]: owedShare1,
            [`users__1__user_id`]: userId2,
            [`users__1__paid_share`]: paidShare2,
            [`users__1__owed_share`]: owedShare2,
        });

        if (categoryId) {
            payload.append('category_id', categoryId);
        }

        // Define the headers
        const headers = {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRF-Token": process.env.X_CSRF_TOKEN,
            "Cookie": `user_credentials=${process.env.USER_CREDENTIALS}; swdid=${process.env.SWDID}; _splitwise_session=${process.env.SPLITWISE_SESSION}`,
            "X-Requested-With": "XMLHttpRequest",
        };

        // Perform the POST request
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: payload,
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Log the response
        if (data.errors && Object.keys(data.errors).length > 0) {
            console.error(`Failed to create expense:`, data.errors);
        } else {
            console.log(`Expense created successfully:`, data);
        }
    } catch (error) {
        console.error(`Error creating expense:`, error);
    }
})();