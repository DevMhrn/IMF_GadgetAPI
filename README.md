# IMF Gadget  API 

*Classified Level 5 Clearance Required*

Secure REST API for managing IMF's covert operational gadgets with mission-critical features and self-destruct capabilities.

## 🔥 Mission-Critical Features

### Core Operations
- **Gadget Inventory Management**
  - `GET /gadgets`: Retrieve all gadgets with dynamic success probability (random 1-100% generated per request) 
  - `POST /gadgets`: Add new gadget with auto-generated codename (e.g., "Midnight Falcon") 
  - `PATCH /gadgets/{id}`: Update gadget specifications
  - `DELETE /gadgets/{id}`: Soft-delete by marking as "Decommissioned" with timestamp

### Emergency Protocols
- `POST /gadgets/{id}/self-destruct`: 
  - Requires unique confirmation code (server-generated 6-digit crypto-random)
  - Permanent status change to "Destroyed"
  - 204 No Content response on success :cite[1]

### Advanced Tactics
- JWT Authentication with role-based access (Agent/Admin/Handler)
- Status filtering: `GET /gadgets?status=Deployed`
- UUIDv4 identifiers for anti-enumeration security
- PostgreSQL database with transaction integrity

## 🛠️ Tech Stack
- **Core**: Node.js 18+ | Express 5.x
- **Database**: PostgreSQL 15 | Sequelize ORM
- **Security**: JWT | bcrypt 

## 🕵️♂️ Data Schema
```Node

 Gadget {
  id: UUIDv4
  codename: string @unique
  name: string
  status: ENUM('Available', 'Deployed', 'Destroyed', 'Decommissioned')
  decommissionedAt: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

# API Endpoints and Security Protocols  

## 📡 API Endpoints  

| Method | Endpoint                       | Clearance Level | Description                   |  
|--------|-------------------------------|------------------|-------------------------------|  
| GET    | `/gadgets`                    | Agent            | List all gadgets              |  
| POST   | `/gadgets`                    | Handler          | Create new gadget             |  
| PATCH  | `/gadgets/{id}`               | Handler          | Update gadget details         |  
| DELETE | `/gadgets/{id}`               | Director         | Decommission gadget           |  
| POST   | `/gadgets/{id}/self-destruct` | Director         | Initiate destruction sequence  |  

## 🛡️ Security Protocols  

- **Encryption**: All communications are secured using AES-256 encrypted JWT tokens.  
- **Refresh Tokens**: Implemented with a 7-day expiry and rotation policy.

## Setup Instructions

### Backend Setup:
1. Clone the repo:
    ```bash
    git clone https://github.com/DevMhrn/IMF_GadgetAPI.git
    cd IMF_GadgetAPI/backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up your `.env` file:
    Create a `.env` file in the `backend` directory:
    ```env
    JWT_SECRET={JWT MESSAGE}
    DATABASE_URL={POSTGRES DB URL}
    NODE_ENV=development
    DB_SSL=false
    DB_SYNC_FORCE=false  # WARNING: This will drop all tables!
    DB_SYNC_ALTER=false  # Use this for safe schema updates
    FRONTEND_URL = http://localhost:5173/
    
    # For normal operation: Keep both sync variables false
    # For schema updates: Set DB_SYNC_ALTER=true
    # For complete reset: Set DB_SYNC_FORCE=true (warning: this deletes all data!)
    ```


4. Start the backend server:
    ```bash
    npm run dev
    ```

### Frontend Setup:
1. Navigate to the `frontend` directory:
    ```bash
    cd ../frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up `.env` for frontend:
    Create a `.env` file in the `frontend` directory:
    ```env
    VITE_FIREBASE_API_KEY={FROM FIREBASE}
    VITE_FIREBASE_AUTH_DOMAIN={FROM FIREBASE}
    VITE_FIREBASE_PROJECT_ID={FROM FIREBASE}
    VITE_FIREBASE_STORAGE_BUCKET={FROM FIREBASE}
    VITE_FIREBASE_MESSAGING_SENDER_ID={FROM FIREBASE}
    VITE_FIREBASE_APP_ID={FROM FIREBASE}
    VITE_FIREBASE_MEASUREMENT_ID={FROM FIREBASE}
    VITE_BACKEND_URL = http://localhost:5000/
    ```

4. Start the frontend:
    ```bash
    npm run dev 
    ```

## Contributing
Feel free to fork and submit pull requests!


    




  



