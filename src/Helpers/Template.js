const template = (otp, userEmail) => {
  return `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
            text-align: center;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .verify-button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 15px 25px;
            text-align: center;
            font-size: 16px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            text-transform: uppercase;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #888888;
            padding-top: 20px;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <div class="header">
            <h2>Verify Your Account</h2>
            <p>Thank you for signing up with Oreby E-commerce!</p>
        </div>

        <div class="otp">
            Your OTP: <span>${otp}</span>
        </div>

        <div style="text-align: center;">
            <a href="http://localhost:5173/otpverify/${userEmail}" target="_blank" class="verify-button">Verify My Account</a>
        </div>

    
        <div class="footer">
            <p>If you didn’t request this email, please ignore it or contact our support team.</p>
            <p>Thank you, <br>The Oreby Team</p>
        </div>
    </div>

</body>
</html>
`;
};
module.exports = template;
