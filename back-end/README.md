# Car Accident Prevention and Emergency Response System

A Node.js application with Express.js and MongoDB that implements a car accident prevention and emergency response system. The system detects accidents based on vehicle sensor data, generates reports, and simulates emergency notifications.

## Features

- Vehicle management with unique IDs
- Sensor data updates and accident detection
- Rule-based accident detection logic
- Accident severity classification
- Report generation for emergency services
- Location mapping using OpenStreetMap via node-geocoder
- Simulated emergency notifications
- Interactive API documentation with Swagger UI

## Prerequisites

- Node.js (v14.0.0 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd car-accident-prevention-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost/car_accident_system
   ```

4. Make sure MongoDB is running on your machine:

   ```bash
   # Start MongoDB (command may vary based on your installation)
   sudo systemctl start mongod
   # or
   mongod
   ```

5. Start the application:

   ```bash
   npm start
   ```

6. Access the API documentation:
   ```
   http://localhost:3000/api-docs
   ```

## Project Structure

```
.
├── controllers/              # Route controllers
│   ├── accidentController.js
│   ├── reportController.js
│   └── vehicleController.js
├── models/                   # Mongoose data models
│   ├── Accident.js
│   ├── Report.js
│   └── Vehicle.js
├── routes/                   # API routes
│   ├── accidentRoutes.js
│   ├── reportRoutes.js
│   └── vehicleRoutes.js
├── utils/                    # Utility functions
│   └── accidentDetection.js
├── .env                      # Environment variables
├── package.json              # Project dependencies
├── README.md                 # Project documentation
├── server.js                 # Main server file
└── swagger.js                # Swagger configuration
```

## API Documentation

The API is fully documented using Swagger UI. Once the application is running, you can access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

The Swagger UI provides a comprehensive interface to:

- Explore available API endpoints
- View request and response schemas
- Test API endpoints with a built-in interface
- Understand the data models and relationships

## API Endpoints

### Vehicle Endpoints

**Create Vehicle**

- **POST** `/api/vehicles`
- Creates a new vehicle with a unique ID
- Request Body:
  ```json
  {
    "vehicleId": "VEH-1234",
    "driverName": "John Doe",
    "imageUrl": "https://example.com/vehicle-image.jpg"
  }
  ```
- Sample cURL:
  ```bash
  curl -X POST http://localhost:3000/api/vehicles \
    -H 'Content-Type: application/json' \
    -d '{"vehicleId": "VEH-1234", "driverName": "John Doe", "imageUrl": "https://example.com/vehicle-image.jpg"}'
  ```

**Update Sensor Data**

- **POST** `/api/update-sensor/:vehicleId`
- Updates sensor data for a specific vehicle and checks for accidents
- Request Body (optional - will generate random data if not provided):
  ```json
  {
    "sensorData": {
      "acceleration": {
        "x": 1.2,
        "y": 0.7,
        "z": 1.5
      },
      "gyroscope": {
        "pitch": 5,
        "roll": 3,
        "yaw": 1
      },
      "gps": {
        "latitude": 37.7749,
        "longitude": -122.4194,
        "speed": 50
      }
    }
  }
  ```
- Sample cURL:
  ```bash
  curl -X POST http://localhost:3000/api/update-sensor/VEH-1234 \
    -H 'Content-Type: application/json'
  ```

**Cause Accident (Simulation)**

- **POST** `/api/cause-accident/:vehicleId`
- Simulates an accident for a specific vehicle
- Sample cURL:
  ```bash
  curl -X POST http://localhost:3000/api/cause-accident/VEH-1234
  ```

**Get All Vehicles**

- **GET** `/api/vehicles`
- Returns all registered vehicles
- Sample cURL:
  ```bash
  curl -X GET http://localhost:3000/api/vehicles
  ```

### Accident Endpoints

**Get All Accidents**

- **GET** `/api/accidents`
- Returns all accident records
- Sample cURL:
  ```bash
  curl -X GET http://localhost:3000/api/accidents
  ```

**Get Accidents by Vehicle ID**

- **GET** `/api/accidents/vehicle/:vehicleId`
- Returns all accidents for a specific vehicle
- Sample cURL:
  ```bash
  curl -X GET http://localhost:3000/api/accidents/vehicle/VEH-1234
  ```

### Report Endpoints

**Get All Reports**

- **GET** `/api/reports`
- Returns all emergency response reports
- Sample cURL:
  ```bash
  curl -X GET http://localhost:3000/api/reports
  ```

**Get Reports by Vehicle ID**

- **GET** `/api/reports/vehicle/:vehicleId`
- Returns all reports for a specific vehicle
- Sample cURL:
  ```bash
  curl -X GET http://localhost:3000/api/reports/vehicle/VEH-1234
  ```

**Update Report Status**

- **PUT** `/api/reports/:reportId`
- Updates the status of a report
- Request Body:
  ```json
  {
    "status": "Notified"
  }
  ```
- Sample cURL:
  ```bash
  curl -X PUT http://localhost:3000/api/reports/60a1b1c1d2e3f4g5h6i7j8k9 \
    -H 'Content-Type: application/json' \
    -d '{"status": "Notified"}'
  ```

## Accident Detection Rules

The system detects accidents based on the following rules:

- High acceleration magnitude (>8 m/s²) indicates a crash
- Abrupt stop (speed <5 km/h with high acceleration) indicates a potential accident
- Unusual rotation (gyroscope roll >90°) indicates a rollover

## License

This project is licensed under the MIT License.
