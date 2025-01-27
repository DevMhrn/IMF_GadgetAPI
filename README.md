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

| Method | Endpoint                      | Clearance Level             | Description                   |  
|--------|-------------------------------|-----------------------------|-------------------------------|  
| GET    | `/gadgets`                    | Handler/Agent/Admin         | List all gadgets              |  
| POST   | `/gadgets`                    | Handler/Agent/Admin         | Create new gadget             |  
| PATCH  | `/gadgets/{id}`               | Handler/Agent/Admin         | Update gadget details         |  
| DELETE | `/gadgets/{id}`               | Handler/Agent/Admin         | Decommission gadget           |  
| POST   | `/gadgets/{id}/self-destruct` | Handler/Agent/Admin         | Initiate destruction sequence |  

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

## POSTMAN Collection
```JSON
  {
	"info": {
		"_postman_id": "your-collection-id",
		"name": "Gadget API",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "Authentication",
			"item": [
				{
					"name": "Login",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"email\": \"admin1@imf.com\",\n    \"firebaseToken\": \"firebase1234\"\n}"
						},
						"url": {
							"raw": "http://localhost:5000/api/auth/login",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "5000",
							"path": [
								"api",
								"auth",
								"login"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "Gadgets",
			"item": [
				{
					"name": "Create Gadget",
					"request": {
						"auth": {
                            "type": "bearer",
                            "bearer": [
                                {
                                    "key": "token",
                                    "value": "{{authToken}}",
                                    "type": "string"
                                }
                            ]
                        },
						"method": "POST",
						"header": [
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            }
                        ],
						"body": {
                            "mode": "raw",
                            "raw": "{\n    \"name\": \"Secret Agent Pen\",\n    \"description\": \"Writes in invisible ink and has a built-in taser.\",\n    \"status\": \"Available\"\n}"
                        },
						"url": {
							"raw": "http://localhost:5000/api/gadgets",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "5000",
							"path": [
								"api",
								"gadgets"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get All Gadgets",
					"request": {
						"auth": {
                            "type": "bearer",
                            "bearer": [
                                {
                                    "key": "token",
                                    "value": "{{authToken}}",
                                    "type": "string"
                                }
                            ]
                        },
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:5000/api/gadgets",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "5000",
							"path": [
								"api",
								"gadgets"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get Available Gadgets",
					"request": {
						"auth": {
                            "type": "bearer",
                            "bearer": [
                                {
                                    "key": "token",
                                    "value": "{{authToken}}",
                                    "type": "string"
                                }
                            ]
                        },
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:5000/api/gadgets?status=Available",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "5000",
							"path": [
								"api",
								"gadgets"
							],
							"query": [
								{
									"key": "status",
									"value": "Available"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "Update Gadget",
					"request": {
						"auth": {
                            "type": "bearer",
                            "bearer": [
                                {
                                    "key": "token",
                                    "value": "{{authToken}}",
                                    "type": "string"
                                }
                            ]
                        },
						"method": "PATCH",
						"header": [
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            }
                        ],
						"body": {
                            "mode": "raw",
                            "raw": "{\n    \"name\": \"Modified Pencil\"\n}"
                        },
						"url": {
							"raw": "http://localhost:5000/api/gadgets/c957e2b6-743d-49eb-bc0e-a29e95e991d0",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "5000",
							"path": [
								"api",
								"gadgets",
								"c957e2b6-743d-49eb-bc0e-a29e95e991d0"
							]
						}
					},
					"response": []
				},
				{
					"name": "Delete Gadget",
					"request": {
						"auth": {
                            "type": "bearer",
                            "bearer": [
                                {
                                    "key": "token",
                                    "value": "{{authToken}}",
                                    "type": "string"
                                }
                            ]
                        },
						"method": "DELETE",
						"header": [],
						"url": {
							"raw": "http://localhost:5000/api/gadgets/c957e2b6-743d-49eb-bc0e-a29e95e991d0",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "5000",
							"path": [
								"api",
								"gadgets",
								"c957e2b6-743d-49eb-bc0e-a29e95e991d0"
							]
						}
					},
					"response": []
				},
				{
					"name": "Self Destruct Gadget",
					"request": {
						"auth": {
                            "type": "bearer",
                            "bearer": [
                                {
                                    "key": "token",
                                    "value": "{{authToken}}",
                                    "type": "string"
                                }
                            ]
                        },
						"method": "POST",
						"header": [],
						"url": {
							"raw": "http://localhost:5000/api/gadgets/c957e2b6-743d-49eb-bc0e-a29e95e991d0/self-destruct",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "5000",
							"path": [
								"api",
								"gadgets",
								"c957e2b6-743d-49eb-bc0e-a29e95e991d0",
								"self-destruct"
							]
						}
					},
					"response": []
				}
			]
		}
	],
	"event": [
        {
            "listen": "prerequest",
            "script": {
                "id": "your-prerequest-script-id",
                "type": "text/javascript",
                "exec": [
                    ""
                ]
            }
        },
        {
            "listen": "test",
            "script": {
                "id": "your-test-script-id",
                "type": "text/javascript",
                "exec": [
                    "// Example test to check for successful status code",
                    "pm.test(\"Status code is 200\", function () {",
                    "    pm.response.to.have.status(200);",
                    "});",
                    "",
                    "// Example test to extract auth token from login response",
                    "if (pm.request.url.getPath().includes('login')) {",
                    "    pm.test(\"Auth token received\", function () {",
                    "        var jsonData = pm.response.json();",
                    "        pm.environment.set(\"authToken\", jsonData.token); // Assuming token is in a 'token' field",
                    "    });",
                    "}"
                ]
            }
        }
    ],
    "variable": [
        {
            "id": "your-auth-token-variable-id",
            "key": "authToken",
            "value": "",
            "type": "string"
        }
    ]
}
```
- Run this collection in your postman for local development 


    




  



