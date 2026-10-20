import { Resend } from 'resend';
import "dotenv/config";

const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
const resend = new Resend(resendApiKey);

export default async function sendMail(to, subject, html) {
  try {
    if (!resendApiKey) {
      console.warn("[Resend] RESEND_API_KEY is not defined in environment. Skipping email to:", to);
      return null;
    }

    const fromAddress = process.env.RESEND_FROM?.trim() || 'JobNest <onboarding@resend.dev>';

    let { data, error } = await resend.emails.send({
      from: fromAddress,
      to: to,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("[Resend] Error with primary from address (" + fromAddress + "):", error);
      if (fromAddress !== 'JobNest <onboarding@resend.dev>') {
        const fallback = await resend.emails.send({
          from: 'JobNest <onboarding@resend.dev>',
          to: to,
          subject: subject,
          html: html,
        });
        if (fallback.error) {
          console.error("[Resend] Fallback error:", fallback.error);
        } else {
          console.log("[Resend] Fallback email sent successfully to", to, fallback.data);
          return fallback.data;
        }
      }
      return null;
    }

    console.log("[Resend] Email sent successfully to", to, data);
    return data;
  } catch (err) {
    console.error("[Resend] Unexpected error in sendMail:", err.message);
    return null;
  }
}

export async function sendApplicationReceivedMail({ to, candidateName, jobTitle, companyName }) {
  if (!to) return;
  const name = candidateName || "Candidate";
  const title = jobTitle || "the position";
  const company = companyName || "the company";

  const subject = `Application Received: ${title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #2563eb; margin-top: 0;">Application Submitted!</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your application for <strong>${title}</strong> at <strong>${company}</strong> has been received.</p>
      <p>Our team and the recruiter will review your application and keep you updated on progress.</p>
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
        Best regards,<br/>
        <strong>JobNest Team</strong>
      </div>
    </div>
  `;

  return sendMail(to, subject, html);
}

export async function sendApplicationStatusMail({ to, candidateName, jobTitle, companyName, status }) {
  if (!to) return;
  const name = candidateName || "Candidate";
  const title = jobTitle || "the position";
  const company = companyName || "the company";
  const isSelected = status === "Selected";

  const subject = isSelected
    ? `Congratulations! You've Passed for ${title}`
    : `Application Status Update: ${title}`;

  const html = isSelected
    ? `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #16a34a; margin-top: 0;">Congratulations, ${name}!</h2>
      <p>We are thrilled to let you know that your application for <strong>${title}</strong> at <strong>${company}</strong> has <strong>Passed / Selected</strong>!</p>
      <p>The hiring team at ${company} will be in touch with you shortly regarding the next steps in the process.</p>
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
        Best regards,<br/>
        <strong>JobNest Team</strong>
      </div>
    </div>
  `
    : `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #475569; margin-top: 0;">Application Status Update</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Thank you for applying for the role of <strong>${title}</strong> at <strong>${company}</strong>.</p>
      <p>After careful evaluation of your application and interview, we regret to inform you that your application was not selected for this position at this time.</p>
      <p>We invite you to explore and apply to other open roles on JobNest that match your skillset.</p>
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
        Best wishes,<br/>
        <strong>JobNest Team</strong>
      </div>
    </div>
  `;

  return sendMail(to, subject, html);
}