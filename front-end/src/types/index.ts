interface SensorData {
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope: {
    pitch: number;
    roll: number;
    yaw: number;
  };
  gps: {
    latitude: number;
    longitude: number;
    speed: number;
  };
}

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export type Vehicle = {
  vehicleId: string;
  vehicleName: string;
  driverName: string;
  imageUrl: string;
  sensorData: SensorData;
  hasAccident: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Accident = {
  _id: string;
  vehicleId: string;
  severity: "High" | "Medium" | "Low";
  time: string;
  status: "Notified" | "Dispatched" | "Resolved";
  sensorData: SensorData;
  location: Location;
  createdAt: string;
  updatedAt: string;
};

export interface NearbyHospital {
  id: string;
  name: string;
  lat: number;
  lon: number;
  distance: number;
}

export type TabType =
  | "vehicles"
  | "accidents"
  | "hospitals"
  | "emergency"
  | "reports"
  | "settings";

export interface Hospital {
  _id: string;
  name: string;
  availableBeds: number;
  location_name: string;
  specialities: string[];
  phoneNumber: string;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  _id: string;
  name: string;
  role: string;
  office_type: string;
  email: string;
  phone: string;
  office_name: string;
  createdAt: string;
  updatedAt: string;
}
