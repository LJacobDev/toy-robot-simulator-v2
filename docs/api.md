# Api Reference for /api/positions


## Authentication

None for this version.

In production, endpoints that modify data (POST, DELETE) would require authentication middleware, and response codes for 401 Unauthorized and 403 Forbidden.


## Common Error Responses

500 Internal Server Error

```
{
    "statusCode": 500,
    "error": "Internal Server Error",
    "message": "Internal Server Error"
}
```

Note: 400 Bad Request does not get sent back.  Currently endpoint is unintentionally accepting malformed inputs such as "x":"a", and validation and error handling needs to be added for this.

Note: 404 Not Found does not apply as no actions need id parameter.


## Methods

### findAll

GET /api/positions

Responses:

200 OK
500 Internal Server Error

200 OK

```
[
    {
        "id": 1,
        "x": 0,
        "y": 0,
        "f": "North"
        "createdAt": "2026-02-10 23:15:53",     //Timestamp in GMT
    },
    {
        "id": 2,
        "x": 0,
        "y": 1,
        "f": "North"
        "createdAt": "2026-02-10 23:15:54",
    }        
]
```


### create

POST /api/positions

Responses:

201 Created,
500 Internal Server Error

Request Body:

```
{
    "x": 0,            // required
    "y": 0,            // required
    "f": "North",      // required
}
```

201 Created

```
{
    "id": 1,
    "x": 0,                              
    "y": 0,                              
    "f": "North",                        
    "createdAt": "2026-02-10 23:15:54"
}
```


### removeAll

Note: Deletes all position history from database, meant for clearing and resetting data

DELETE /api/positions

Responses:

200 OK,
500 Internal Server Error

200 OK

```
{
    "deleted": true
}
```