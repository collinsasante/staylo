/**
 * Email and Notification Utilities
 * Handles email notifications, Slack alerts, and other notifications
 */

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SlackNotification {
  text: string;
  blocks?: any[];
}

/**
 * Send email notification (placeholder - integrate with SendGrid, Resend, etc.)
 * To use: Install SendGrid or Resend and add API keys to .env
 */
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (data: EmailData): Promise<boolean> => {
  try {
    await resend.emails.send({
      from: "Staylo <noreply@staylo.com>",
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

/**
 * Send Slack notification
 */
export const sendSlackNotification = async (
  notification: SlackNotification
): Promise<boolean> => {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      console.log("[SLACK] Webhook URL not configured");
      return false;
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`);
    }

    console.log("[SLACK] Notification sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending Slack notification:", error);
    return false;
  }
};

/**
 * Send inquiry notification to admin
 */
export const sendInquiryNotification = async (inquiry: {
  studentName: string;
  email: string;
  phone: string;
  hostelInterested: string;
  message: string;
}): Promise<void> => {
  // Send email to admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@staylo.com";

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #666; }
          .value { margin-top: 5px; }
          .footer { text-align: center; color: #999; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏨 New Inquiry - Staylo</h1>
          </div>
          <div class="content">
            <h2>New Student Inquiry Received</h2>

            <div class="field">
              <div class="label">Student Name:</div>
              <div class="value">${inquiry.studentName}</div>
            </div>

            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${inquiry.email}">${inquiry.email}</a></div>
            </div>

            <div class="field">
              <div class="label">Phone:</div>
              <div class="value"><a href="tel:${inquiry.phone}">${inquiry.phone}</a></div>
            </div>

            <div class="field">
              <div class="label">Hostel Interested In:</div>
              <div class="value">${inquiry.hostelInterested}</div>
            </div>

            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${inquiry.message}</div>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated notification from Staylo Admin Panel</p>
            <p>Login to your <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">admin panel</a> to respond</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const emailText = `
New Student Inquiry

Student Name: ${inquiry.studentName}
Email: ${inquiry.email}
Phone: ${inquiry.phone}
Hostel: ${inquiry.hostelInterested}

Message:
${inquiry.message}

Login to your admin panel to respond: ${process.env.NEXT_PUBLIC_APP_URL}/admin/inquiries
  `;

  await sendEmail({
    to: adminEmail,
    subject: `New Inquiry from ${inquiry.studentName}`,
    html: emailHtml,
    text: emailText,
  });

  // Send Slack notification if configured
  await sendSlackNotification({
    text: `🆕 New inquiry from *${inquiry.studentName}*`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🏨 New Student Inquiry",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Student:*\n${inquiry.studentName}`,
          },
          {
            type: "mrkdwn",
            text: `*Email:*\n${inquiry.email}`,
          },
          {
            type: "mrkdwn",
            text: `*Phone:*\n${inquiry.phone}`,
          },
          {
            type: "mrkdwn",
            text: `*Hostel:*\n${inquiry.hostelInterested}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Message:*\n${inquiry.message}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View in Admin Panel",
            },
            url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/inquiries`,
            style: "primary",
          },
        ],
      },
    ],
  });
};

/**
 * Send confirmation email to student
 */
export const sendInquiryConfirmation = async (inquiry: {
  studentName: string;
  email: string;
  hostelInterested: string;
}): Promise<void> => {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏨 Inquiry Received - Staylo</h1>
          </div>
          <div class="content">
            <h2>Hello ${inquiry.studentName}!</h2>
            <p>Thank you for your inquiry about <strong>${inquiry.hostelInterested}</strong>.</p>
            <p>We have received your message and will get back to you within 24 hours.</p>
            <p>If you have any urgent questions, feel free to contact us directly.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The Staylo Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: inquiry.email,
    subject: "Your Inquiry Has Been Received - Staylo",
    html: emailHtml,
  });
};
