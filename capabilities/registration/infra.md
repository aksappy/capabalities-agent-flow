# HTTP
[x] Given a user wants to register, when an HTTP request is incoming with email and password, then invoke the registration module.
> **Status: COMPLETED**
[x] Given a user wants to register, when an HTTP request is incoming with email and password and email is duplicate from domain, then return an conflict response
> **Status: COMPLETED**
[x] Given a user wants to register, when an HTTP request is incoming with email and password, then validate that the incoming payload has a valid email and a valid password with atleast 8 characters and respond with a 400 response if validation fails
> **Status: COMPLETED**
[x] Given a user wants to register, when an HTTP request is incoming with email and password and the registration is successful, then respond with a success response 204.
> **Status: COMPLETED**

# Database
[ ] Given a user wants to register, when registration module invokes the repository to save the user, then the user should be saved in the database.
[ ] Given a user wants to register, when registration module invokes the repository to fetch the user by email, then the user should be fetched from the database.