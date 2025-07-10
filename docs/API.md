# 📋 API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://api.zerowaste-link.com/api`

## Authentication

All API requests require authentication except for registration and login.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91 98765 43210",
  "role": "donor",
  "address": {
    "street": "123 Main St",
    "area": "Andheri",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001"
  },
  "aadhaarNumber": "1234 5678 9012"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor"
  },
  "token": "jwt_token"
}
```

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor"
  },
  "token": "jwt_token"
}
```

### Donations

#### Get All Donations
```http
GET /api/donations
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (pending, accepted, completed)
- `donorId` - Filter by donor ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "donation_id",
      "foodType": "Cooked Food",
      "quantity": "25 kg",
      "donorId": "donor_id",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### Create Donation
```http
POST /api/donations
```

**Request Body:**
```json
{
  "foodType": "Cooked Food",
  "quantity": "25 kg",
  "description": "Fresh food from restaurant",
  "expiryTime": "2024-01-01T18:00:00Z",
  "pickupAddress": {
    "street": "123 Restaurant St",
    "area": "Bandra",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400050"
  },
  "images": ["image1.jpg", "image2.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Donation created successfully",
  "data": {
    "id": "donation_id",
    "foodType": "Cooked Food",
    "quantity": "25 kg",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### AI Services

#### Detect Spoilage
```http
POST /api/ai/detect-spoilage
```

**Request Body:**
```json
{
  "image": "base64_encoded_image",
  "foodType": "vegetables"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "spoilageLevel": "low",
    "confidence": 0.95,
    "recommendations": [
      "Store in cool, dry place",
      "Use within 2 days"
    ]
  }
}
```

#### Impact Analysis
```http
POST /api/ai/impact
```

**Request Body:**
```json
{
  "donationId": "donation_id",
  "quantity": "25 kg",
  "foodType": "cooked"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "peopleServed": 50,
    "co2Saved": 75,
    "waterSaved": 1500,
    "impactScore": 8.5
  }
}
```

### Admin

#### Get Platform Analytics
```http
GET /api/admin/analytics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDonations": 1250,
    "totalUsers": 450,
    "totalFoodSaved": "15,000 kg",
    "totalImpact": {
      "peopleServed": 30000,
      "co2Saved": 45000,
      "waterSaved": 900000
    }
  }
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **File uploads**: 10 requests per minute

## WebSocket Events

### Chat
- `join_room` - Join chat room
- `leave_room` - Leave chat room
- `send_message` - Send message
- `receive_message` - Receive message

### Tracking
- `location_update` - Update location
- `status_change` - Update status
- `real_time_update` - Real-time updates
