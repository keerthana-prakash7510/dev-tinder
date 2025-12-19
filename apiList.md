# DevTinder Apis
authRouter
- POST /signUp 
- POST /login
- POST /logout

profileRouter
- GET profile/view
- PATCH profile/edit
- PATCH profile/password

connectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
instead of creating these two abpis we can create one api
- POST /request/send/status/:userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

similarly we can create one api for the above accepting and rejecting
- POST /request/review/status/:requestId



userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed

Status: ignore, interested, accepted, rejected


