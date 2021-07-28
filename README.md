# BigBite (Server-Side Application)

Backend program for food delivery application; similar to existing products like GrubHub, UberEats, DoorDash, etc.

## API Reference

### User Endpoints

#### **User: Login**

```
POST /api/user/login
```

Input

```http
{
  "email": String,
  "password": String (Hashed)
}
```

Outputs

```http
Success:
{
  "token": JWT Token
}

Error:
{
  "message": Error Description
}
```

#### **User: Register**

```http
POST /api/user/register
```

Input

```http
{
  "email": String,
  "password": String,
  "firstName": String,
  "lastName": String,
  "location": {
      "address": String,
      "apt": String,
      "city": String,
      "state": String,
      "zip": String
  },
  "phone": String
}
```

Outputs

```http
Success:
{
  "id": String
}

Error:
{
  "message": Error Description
}
```

#### User: Get List Of Restaurants

```http
GET /api/user/
```

Input
| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `auth-token` | `JWT Token` | **Required**: The token returned when the logging in. |

Outputs

```http
Success:
{
  restaurants: [
    "_id": String,
    "restaurantName": String,
    "location": {
      "address": String,
      "apt": String,
      "city": String,
      "state": String,
      "zip": String
    }
  ],
}

Error:
{
  "message": Error Description
}
```

#### **User: Get Details on Specific Restaurant**

```http
GET /api/user/:restaurantId
```

Input
| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `auth-token` | `JWT Token` | **Required**: The token returned when the logging in. |

| Parameter      | Type     | Description                              |
| :------------- | :------- | :--------------------------------------- |
| `restaurantId` | `String` | **Required**: Id of specific restaurant. |

Outputs

```http
Success:
{
  "location": {
    "address": String,
    "apt": String,
    "city": String,
    "state": String,
    "zip": String
  },
  "schedule": [],
  "menu": [
    {
      "_id": String,
      "itemName": String,
      "price": Number,
      "description": String
    }
  ],
  "_id": String,
  "restaurantName": String,
  "email": String,
  "phone": String,
}


Error:
{
  "message": Error Description
}
```

#### **User: Get Details on Specific Item From Specific Restaurant**

```http
GET /api/user/:restaurantId/:itemId
```

Input
| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `auth-token` | `JWT Token` | **Required**: The token returned when the logging in. |

| Parameter      | Type     | Description                              |
| :------------- | :------- | :--------------------------------------- |
| `restaurantId` | `String` | **Required**: Id of specific restaurant. |
| `itemId`       | `String` | **Required**: Id of specific item.       |

Outputs

```http
Success:
{
  "_id": String,
  "itemName": String,
  "price": Number,
  "description": String
}

Error:
{
  "message": Error Description
}
```

#### **User: Add Item To Bag**

```http
POST /api/user/:restaurantId/:itemId
```

Input

```http
{
  "quantity": Number
}
```

| Header       | Type        | Description                                           |
| :----------- | :---------- | :---------------------------------------------------- |
| `auth-token` | `JWT Token` | **Required**: The token returned when the logging in. |

| Parameter      | Type     | Description                              |
| :------------- | :------- | :--------------------------------------- |
| `restaurantId` | `String` | **Required**: Id of specific restaurant. |
| `itemId`       | `String` | **Required**: Id of specific item.       |

Outputs

```http
Success:
{
  "_id": String,
  "itemName": String,
  "price": Number,
  "description": String
}

Error:
{
  "message": Error Description
}
```

### Restaurant Endpoints

#### **Restaurant: Login**

```
POST /api/restaurant/login
```

Input

```http
{
  "email": String,
  "password": String (Hashed)
}
```

Outputs

```http
Success:
{
  "token": JWT Token
}

Error:
{
  "message": Error Description
}
```

#### **Restaurant: Register**

```http
POST /api/restaurant/register
```

Input

```http
{
  "email": String,
  "password": String,
  "restaurantName": String,
  "location": {
      "address": String,
      "apt": String,
      "city": String,
      "state": String,
      "zip": String
  },
  "phone": String
}
```

Outputs

```http
Success:
{
  "id": String
}

Error:
{
  "message": Error Description
}
```

#### **Restaurant: Get Menu**

```http
GET /api/restaurant/menu
```

Input
| Header | Type | Description |
| :-------- | :------- | :------------------------- |
| `auth-token` | `JWT Token` | **Required**: The token returned when the logging in. |

Outputs

```http
Success:
{
  "_id": String,
  "itemName": String,
  "price": Number,
  "description": String
}

Error:
{
  "message": Error Description
}
```

#### **Restaurant: Add Item To Menu**

```http
POST /api/restaurant/menu/add
```

Input

```http
{
  "_id": String,
  "itemName": String,
  "price": Number,
  "description": String
}
```

| Header       | Type        | Description                                           |
| :----------- | :---------- | :---------------------------------------------------- |
| `auth-token` | `JWT Token` | **Required**: The token returned when the logging in. |

Outputs

```http
Success:
{
  "message": "Success"
}

Error:
{
  "message": Error Description
}
```

#### **Restaurant: Remove Item From Menu**

```http
DELETE /api/restaurant/menu/:itemId
```

Input

| Header       | Type        | Description                                           |
| :----------- | :---------- | :---------------------------------------------------- |
| `auth-token` | `JWT Token` | **Required**: The token returned when the logging in. |

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `itemId`  | `String` | **Required**: Id of specific item. |

Outputs

```http
Success:
{
  "message": "Removed"
}

Error:
{
  "message": Error Description
}
```

#### **Restaurant: Update Item From Menu**

```http
PATCH /api/restaurant/menu/:itemId
```

Input
Input

```http
{
  "itemName": String,
  "price": Number,
  "description": String
}
```

| Header       | Type        | Description                                           |
| :----------- | :---------- | :---------------------------------------------------- |
| `auth-token` | `JWT Token` | **Required**: The token returned when the logging in. |

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `itemId`  | `String` | **Required**: Id of specific item. |

Outputs

```http
Success:
{
  "message": "Updated"
}

Error:
{
  "message": Error Description
}
```
