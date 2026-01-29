[x] Given a user with email and password, when user wants to login, then return a jwt token if the user exists and password is correct
> **Status: COMPLETED**
[x] Given a user with email and password, when user wants to login and user does not exist, then return authentication error
> **Status: COMPLETED**
[x] Given a user with email and password, when user wants to login and password is incorrect, then return authentication error
> **Status: COMPLETED**
[x] Given a user with email and password, when user tries login for more than 3 times, then return authentication error every time and block the user
> **Status: COMPLETED**
[ ] Given a user with email and password, when user tries to login after being blocked, then validate that the login is attempted with a one-time-pin #ambiguous how will the user get it? During forgot password? #integration [forgot-password](../forgot-password/core.md)