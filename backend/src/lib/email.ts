import nodemailer from 'nodemailer';

// Configure this with your actual SMTP details in production or use Ethereal for testing
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendRegistrationEmail = async (teamName: string, leaderEmail: string, teamId: string, password: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"Hackathon Admin" <noreply@hackathon.com>',
      to: leaderEmail,
      subject: "Hackathon Team Registration Successful!",
      text: `Hello ${teamName},\n\nYour team has been successfully registered!\n\nTeam ID: ${teamId}\nPortal Password: ${password}\n\nPlease keep these credentials safe. You will need them to log in to the portal.\n\nBest regards,\nHackathon Team`,
      html: `
        <h2>Registration Successful!</h2>
        <p>Hello <strong>${teamName}</strong>,</p>
        <p>Your team has been successfully registered for the hackathon!</p>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Team ID:</strong> <span style="color: #007bff;">${teamId}</span></p>
          <p><strong>Portal Password:</strong> <span style="color: #d97706;">${password}</span></p>
        </div>
        <p>Please keep these credentials safe. You will need them to log in to the participant portal.</p>
        <p>Best regards,<br/>Hackathon Admin Team</p>
      `
    });

    console.log("Registration email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};
