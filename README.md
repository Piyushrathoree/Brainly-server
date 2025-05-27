# Brainly Server API Documentation

A RESTful API for managing content bookmarking and sharing with user authentication.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
RESEND_API_KEY=your_resend_api_key
CLIENT_URL=http://localhost:5173
```

## Authentication Endpoints

### Register User
```http
POST /api/v1/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
}
```

### Login User
```http
POST /api/v1/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "securepassword123"
}
```

### Verify User
```http
POST /api/v1/verify
Content-Type: application/json

{
    "verificationCode": "123456"
}
```

### Forgot Password
```http
POST /api/v1/forgot-password
Content-Type: application/json

{
    "email": "john@example.com"
}
```

### Reset Password
```http
POST /api/v1/reset-password/:token
Content-Type: application/json

{
    "password": "newpassword123"
}
```

### Logout User
```http
POST /api/v1/logout
Authorization: Bearer {token}
```

## Content Management Endpoints

### Add Content
```http
POST /api/v1/content/add
Authorization: Bearer {token}
Content-Type: application/json

{
    "title": "Interesting Article",
    "link": "https://example.com/article",
    "type": "article",
    "tags": ["technology", "programming"]
}
```

### Update Content
```http
PUT /api/v1/content/update/:id
Authorization: Bearer {token}
Content-Type: application/json

{
    "title": "Updated Title",
    "link": "https://example.com/updated-article"
}
```

### Delete Content
```http
DELETE /api/v1/content/delete/:id
Authorization: Bearer {token}
```

### Get Content by ID
```http
GET /api/v1/content/get-content/:id
Authorization: Bearer {token}
```

### Get User's Content
```http
GET /api/v1/content/user/:userId
Authorization: Bearer {token}
```

### Get Public Content
```http
GET /api/v1/content/share/:userId
```

## Tag Management Endpoints

### Create Tag
```http
POST /api/v1/tags/create
Content-Type: application/json

{
    "title": "technology"
}
```

### Show All Tags
```http
GET /api/v1/tags/show
```

### Get Content by Tag
```http
GET /api/v1/tags/content?title=technology
```

## User Profile Management

### Get User Profile
```http
GET /api/v1/profile
Authorization: Bearer {token}
```

### Toggle Share Settings
```http
PUT /api/v1/share/toggle
Authorization: Bearer {token}
```

## Response Examples

### Successful Registration
```json
{
    "message": "User registered successfully",
    "token": "jwt_token_here",
    "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "isVerified": false
    }
}
```

### Successful Login
```json
{
    "message": "User logged in successfully",
    "token": "jwt_token_here",
    "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "isVerified": true
    }
}
```

## Error Responses

```json
{
    "message": "Error message here"
}
```

## Installation and Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/Brainly-server.git
```

2. Install dependencies
```bash
cd Brainly-server
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your values
```

4. Run the development server
```bash
npm run dev
```

## Built With
- Node.js
- Express.js
- MongoDB
- TypeScript
- JWT Authentication
- Resend Email Service

## License

This project is licensed under the ISC License.


