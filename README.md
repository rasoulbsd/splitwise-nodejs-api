# Splitwise API Scripts

## Introduction
This repository contains a set of Node.js scripts to interact with the Splitwise API. The scripts currently implement the following functionalities:

1. **Fetch Expenses**: Retrieve a list of expenses for a specific user or group.
2. **Delete Expense**: Delete an expense using its unique ID.
3. **Create Expense**: Create a new expense with specified details.

## Prerequisites
- **Node.js**: Ensure Node.js (version 18 or higher) is installed.
- **Splitwise Account**: These scripts require an authenticated session with Splitwise. You must extract certain credentials from your browser.

## Setup
1. **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Create a `.env` file by copying the provided example:**
    ```bash
    cp .env.example .env
    ```

4. **Update the `.env` file with your Splitwise session details:**
    - `X_CSRF_TOKEN`: Your CSRF token.
    - `USER_CREDENTIALS`: Your user credentials cookie.
    - `SWDID`: Your SWDID cookie.
    - `SPLITWISE_SESSION`: Your Splitwise session cookie.

## Scripts

### 1. Fetch Expenses
Retrieve a list of expenses for a specific user or group.

**Usage:**
```bash
node fetchExpenses.js --friend_id <id> --limit <number>
```
Options:
	•	--friend_id <id>: The Splitwise friend ID (required).
	•	--limit <number>: The maximum number of expenses to fetch (required).

Example:
```bash
node fetchExpenses.js --friend_id 22088182 --limit 25
```

Response Example:

```json
{
  "expenses": [
    {
      "id": 123456,
      "description": "Dinner",
      "cost": "50.00",
      "currency_code": "USD"
    }
  ]
}
```
2. Delete Expense
Delete an expense using its unique ID.

Usage:
```bash
node deleteExpense.js --id <expense_id>
```
Options:
	•	--id <expense_id>: The ID of the expense to delete (required).

Example:
```bash
node deleteExpense.js --id 3503931874
```
Response Example:
	•	If the expense is successfully deleted:

```
Expense with ID 3503931874 seems to have already been deleted or the ID is incorrect.
```
	•	If there are errors:
```json
Failed to delete expense with ID 3503931874: { "error": "Expense does not exist" }
```
3. Create Expense
Create a new expense with specified details.
Usage:

```bash
node createExpense.js [options]
```
Options:
	•	--cost <amount>: The total cost of the expense (required).
	•	--currency_code <currency>: The currency code (e.g., USD, CAD) (required).
	•	--group_id <group_id>: The group ID (use 0 for personal expenses) (required).
	•	--user_id1 <id>: The first user’s ID (required).
	•	--paid_share1 <amount>: The amount paid by the first user (required).
	•	--owed_share1 <amount>: The amount owed by the first user (required).
	•	--user_id2 <id>: The second user’s ID (required).
	•	--paid_share2 <amount>: The amount paid by the second user (required).
	•	--owed_share2 <amount>: The amount owed by the second user (required).
	•	--description <text>: A description of the expense (required).
	•	--category_id <id>: The category ID (optional).
	•	--date <date_string>: The date of the expense (optional).

Example:

```bash
node createExpense.js --cost 22 --currency_code CAD --group_id 0 --user_id1 16073027 --paid_share1 22.00 --owed_share1 11.00 --user_id2 22088182 --paid_share2 0.00 --owed_share2 11.00 --description "Test Expense" --category_id 18 --date "2024-12-29"
```
Response Example:
	•	On success:

```
Expense created successfully: { expense: { id: 123456, cost: 22, ... } }
```

	•	On failure:
```json
Failed to create expense: { "error": "Invalid user_id" }
```

Additional Splitwise API Routes

These scripts cover only a subset of the Splitwise API. Splitwise provides many other routes and functionalities, such as:
	•	Get Friend Details:
```bash
GET https://secure.splitwise.com/api/v3.0/get_friend/<id>
```

Example Response:

```json
{
  "friend": {
    "id": 22088182,
    "first_name": "John"
  }
}
```
	•	Get Main Data:

```bash
GET https://secure.splitwise.com/api/v3.0/get_main_data
```

Example Response:
```json
{
  "groups": [...],
  "friends": [...]
}
```

	•	Get Metadata:

```bash
GET https://secure.splitwise.com/api/v4.0/metadata
```

Example Response:

```json
{
  "categories": [...],
  "currencies": [...]
}
```
Notes
	•	These scripts are designed to work with the current Splitwise API, but API changes may require updates.
	•	The descriptions and options in these scripts are not exhaustive and may need adjustments for specific use cases.

Disclaimer

These scripts are not affiliated with or endorsed by Splitwise. Use them at your own discretion. Ensure that you comply with Splitwise’s terms of service and API usage guidelines.

```
---

**Creating the `.env.example` File**

To create the `.env.example` file, follow these steps:

1. **Open VSCode:**
   - Launch Visual Studio Code on your computer.

2. **Navigate to Your Project Directory:**
   - Use the **Explorer** sidebar to navigate to the root directory of your project.

3. **Create a New File:**
   - Right-click within the Explorer sidebar.
   - Select **"New File"**.
   - Name the file `.env.example` and press **Enter**.

4. **Add the Configuration Content:**
   - Click on the newly created `.env.example` file to open it in the editor.
   - Paste the following content:
     ```env
     # Splitwise API Configuration
     
     # Your CSRF Token, required for authentication
     X_CSRF_TOKEN=your_csrf_token_here
     
     # Your Splitwise session cookies for authentication
     USER_CREDENTIALS=your_user_credentials_here
     SWDID=your_swdid_here
     SPLITWISE_SESSION=your_splitwise_session_here
     ```

5. **Save the File:**
   - Press **Ctrl + S** (Windows/Linux) or **Cmd + S** (Mac) to save the file.

---

**Final Steps**

1. **Fill in Your Credentials:**
   - Replace the placeholder values (`your_csrf_token_here`, `your_user_credentials_here`, etc.) with your actual Splitwise session details.

2. **Secure Your `.env` File:**
   - Ensure that your `.env` file is added to `.gitignore` to prevent sensitive information from being committed to version control.
     ```gitignore
     # Environment Variables
     .env
     ```

3. **Use the `.env` File in Your Scripts:**
   - Your Node.js scripts can now load these environment variables using packages like `dotenv`.
     ```javascript
     require('dotenv').config();

     const csrfToken = process.env.X_CSRF_TOKEN;
     const userCredentials = process.env.USER_CREDENTIALS;
     const swdid = process.env.SWDID;
     const splitwiseSession = process.env.SPLITWISE_SESSION;

     // Your code here
     ```

---

Feel free to copy the entire markdown content above and save it as `README.md` in your repository. Additionally, follow the instructions to create and configure your `.env.example` file properly.

If you encounter any further issues, please let me know!
```