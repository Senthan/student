# A version controlled key-value store with a HTTP AP

# Student

1.

Method: GET

Endpoint: /object/mykey

Response: value1


User - Read data of a User

GET
/user/:label
Permission: none 

example
curl -i http://student.senthaneng.com:3001/user/:label

Parameter

Field     Type     Description
label     string   The Users-label.


Success 200

Field       Type          Description
label       string        The User-label.
value       blob/string   The User-value.


Error 4xx

Field                      Description
UserNotFound               The label of the User was not found.


2.

Method: POST

Endpoint: /object

Body: JSON: {mykey : value1}

Time: 6pm


User - Read data of a User

POST
/user
Permission: none 


Parameter

Field     Type                          Description
label     string                        The Users-label.
value     blob/string                   The User-value.


Success 200

Field       Type                        Description
value       blob/string                 The User-value.


Error 4xx

Field                                   Description
key and value is required               key and value is required



3.

Method: GET

Endpoint: /object/mykey?timestamp=1440568980 [6.03pm]

Response: value1


User - Read data of a User

GET
/user/:label
Permission: none 

example
curl -i http://student.senthaneng.com:3001/user/:label?timestamp=1440568980

Parameter

Field     Type             Description
label     string           The Users-label.


Success 200

Field       Type           Description
label       string         The User-label.
value       blob/string    The User-value.
timestamp   bigint         The User-timestamp


Error 4xx

Field                      Description
UserNotFound               The label of the User was not found.






# Create .env file, set timezone and set database configurtion 

host=localhost
database=student
user=root
password=root
TIMEZONE=UTC






