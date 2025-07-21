# ReceiptIQ Web

ReceiptIQ is a web application designed for AI-powered data extraction from receipts. This repository contains the frontend implementation of the ReceiptIQ application, built with Next.js and Mantine.

## Features

- **User Authentication**: Secure user authentication with email/password and social providers.
- **Project Management**: Create, view, update, and delete projects to organize your receipt data extraction tasks.
- **Receipt Processing**: Upload and process receipts to extract relevant data.
- **Data Export**: Export extracted data in various formats.
- **Subscription Management**: Manage your subscription and billing information.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/brawl-ai/receiptiq_web.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd receiptiq_web
    ```

3.  Install the dependencies:

    ```bash
    npm install
    ```

4.  Create a `.env.local` file in the root of the project and add the necessary environment variables:

    ```
    BACKEND_API_BASE=your_backend_api_url
    CLIENT_ID=your_client_id
    CLIENT_SECRET=your_client_secret
    ```

### Running the Application

To run the application in development mode, use the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

The project is structured as a standard Next.js application with the following key directories:

- `app/`: Contains the application's pages and API routes.
- `app/api/`: Handles backend API requests, including authentication and data processing.
- `app/dashboard/`: Contains the main dashboard components for project management and user profile.
- `app/lib/`: Includes utility functions, authentication logic, and context providers.
- `public/`: Stores static assets like images and documents.

## API Reference

The application uses a set of API routes to interact with the backend service. Here's a summary of the available routes:

- `POST /api/login`: Authenticates a user and returns an access token.
- `POST /api/signup`: Creates a new user account.
- `POST /api/password/forgot`: Initiates the password reset process.
- `POST /api/password/reset`: Resets a user's password.
- `GET /api/refresh`: Refreshes the user's access token.
- `POST /api/otp/get`: Sends a one-time password to the user.
- `POST /api/otp/check`: Verifies a one-time password.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any suggestions or improvements.

## License

This project is licensed under the ISC License. See the `LICENSE` file for more details.
