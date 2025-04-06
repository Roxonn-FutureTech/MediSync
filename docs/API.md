# MediSync API Documentation

## Overview
The MediSync API provides endpoints for managing hospital information in the emergency portal system.

## Base URL
```
http://localhost:5000
```

## Rate Limiting
- Default limits: 200 requests per day, 50 requests per hour
- Specific endpoints may have additional rate limits

## Endpoints

### Health Check
```
GET /health
```
Returns the API status.

**Response**
```json
{
    "status": "OK"
}
```

### List Hospitals
```
GET /api/hospitals
```
Returns a list of all hospitals.

**Response**
```json
[
    {
        "id": 1,
        "name": "General Hospital",
        "address": "123 Main St",
        "phone": "123-456-7890",
        "capacity": 100,
        "created_at": "2024-04-05T12:00:00Z"
    }
]
```

### Get Hospital
```
GET /api/hospitals/{id}
```
Returns details of a specific hospital.

**Response**
```json
{
    "id": 1,
    "name": "General Hospital",
    "address": "123 Main St",
    "phone": "123-456-7890",
    "capacity": 100,
    "created_at": "2024-04-05T12:00:00Z"
}
```

### Register Hospital
```
POST /api/hospitals
```
Creates a new hospital.

**Request Body**
```json
{
    "name": "General Hospital",
    "address": "123 Main St",
    "phone": "123-456-7890",
    "capacity": 100
}
```

**Response**
```json
{
    "id": 1,
    "name": "General Hospital",
    "address": "123 Main St",
    "phone": "123-456-7890",
    "capacity": 100,
    "created_at": "2024-04-05T12:00:00Z"
}
```

### Update Hospital
```
PUT /api/hospitals/{id}
```
Updates an existing hospital.

**Request Body**
```json
{
    "name": "Updated Hospital",
    "address": "456 New St",
    "phone": "987-654-3210",
    "capacity": 150
}
```

**Response**
```json
{
    "id": 1,
    "name": "Updated Hospital",
    "address": "456 New St",
    "phone": "987-654-3210",
    "capacity": 150,
    "created_at": "2024-04-05T12:00:00Z"
}
```

### Delete Hospital
```
DELETE /api/hospitals/{id}
```
Deletes a hospital.

**Response**
- Status Code: 204 No Content

## Error Responses

### Validation Error (400)
```json
{
    "error": "Validation Error",
    "message": {
        "field": ["error message"]
    },
    "status_code": 400
}
```

### Not Found (404)
```json
{
    "error": "Not Found",
    "message": "The requested resource was not found",
    "status_code": 404
}
```

### Rate Limit Exceeded (429)
```json
{
    "error": "Rate Limit Exceeded",
    "message": "Too many requests",
    "status_code": 429
}
```

## Validation Rules
- Name: 1-100 characters
- Address: 1-200 characters
- Phone: Valid phone number format
- Capacity: Positive integer 