export const verificationMail = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
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
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .code {
      font-size: 24px;
      font-weight: bold;
      color: #245D7F;
      margin: 20px 0;
    }
    p {
      color: #555;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Verify Your Email</h2>
    <p>Use the verification code below:</p>
    <div class="code">VERIFICATION_CODE</div>
    <p>This code will expire in 10 minutes.<br>If you didn't request this, please ignore this email.</p>
  </div>
</body>
</html>
`;