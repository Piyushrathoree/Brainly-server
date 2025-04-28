"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeBackMail = exports.forgotPasswordMail = exports.verificationMail = void 0;
exports.verificationMail = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4faff;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 20px;
      max-width: 400px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .title {
      color: #0056d2;
    }
    .code {
      font-size: 26px;
      font-weight: bold;
      color: #0056d2;
      margin: 20px 0;
    }
    p {
      color: #555;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2 class="title">Verify Your Email</h2>
    <p>Use the verification code below:</p>
    <div class="code">__CODE__</div>
    <p>This code will expire in 10 minutes.<br>If you didn't request this, please ignore this email.</p>
  </div>
</body>
</html>
`;
exports.forgotPasswordMail = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4faff;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 50px auto;
      padding: 30px;
      max-width: 400px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .title {
      color: #0056d2;
      margin-bottom: 20px;
    }
    p {
      color: #555;
      margin-bottom: 30px;
    }
    .button {
      background-color: #0056d2;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      display: inline-block;
    }
    .button:hover {
      background-color: #0041a8;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2 class="title">Reset Your Password</h2>
    <p>Click the button below to reset your password:</p>
    <a href="__RESET_LINK__" class="button">Reset Password</a>
    <p>If you didn't request this, please ignore this email.</p>
  </div>
</body>
</html>
`;
exports.welcomeBackMail = `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">
<head>
  <meta charset="UTF-8">
  <title>Welcome Back</title>
</head>
<body style="background-color: #f6f9fc; margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 50px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; padding: 40px;">
          <tr>
            <td align="center" style="color: #007bff; font-size: 28px; font-weight: bold; margin-bottom: 20px;">
              Welcome Back!
            </td>
          </tr>
          <tr>
            <td align="center" style="color: #333333; font-size: 16px; line-height: 1.6; padding: 20px;">
              We're happy to see you again.<br>
              Continue Exploring,Collabrating, and Growing with us.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 30px;">
              <a href="__Dashboard_link__" 
                 style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px;">
                Go to Your Dashboard
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="color: #888888; font-size: 12px; padding-top: 40px;">
              If you didn’t try to login, please ignore this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
