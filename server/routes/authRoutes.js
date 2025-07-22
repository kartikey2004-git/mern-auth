import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  refreshAccessToken,
  register,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", userAuth ,logout);
authRouter.post("/refresh-token", refreshAccessToken);


authRouter.get("/is-auth", userAuth, isAuthenticated);


authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);

authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);


export default authRouter;

/*

1. User Registration (Done)
   
   - You hash the password before saving.
   - Store isEmailVerified, OTPs, etc.
   - Created model for User with necessary fields.

2. Login Controller (Done)
   
   - Check email/password.

   If valid:

    - Generate access token
    - Generate refresh token
    - Store refresh token inside user.refreshTokens (an array in DB)
    - Set refreshToken in httpOnly cookie
    - Return access token in response


3. Refresh Access Token (Done)

   - Reads the refresh token from cookies.
   - Verifies it using jwt.verify.
  
   - Finds the user by decoded ID.
   - Checks if token exists in user's refreshToken array.
   
   - If valid, generates new access token.
   - Returns that access token in response.
   
   - Security Added: Protects against reuse by storing each token.


4. Access Token Middleware (userAuth) (Done)  
    
    - Middleware to verify access token (from cookie or Authorization header).

    - Attaches req.user after decoding.
    - Used to protect routes like /is-auth.


5. Logout (Done)

   - Removes refresh token from DB (array).
   - Clears cookie.

6. Protected Route Check (Done)

   - GET /api/auth/is-auth uses userAuth middleware.

Returns 201 if user is valid/authenticated.

*/
