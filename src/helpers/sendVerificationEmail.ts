import { emailjs, getEmailJsConfig } from "@/lib/emailjs";
import { EmailJSResponseStatus } from "@emailjs/nodejs";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    const { publicKey, privateKey, serviceId, templateId } =
      getEmailJsConfig();

    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        email,
        username,
        code: verifyCode,
        expiry_time: new Date().toLocaleString(),
        platform: "AnoniMessage",
        subject: "AnoniMessage | Verification Code",
      },
      { publicKey, privateKey }
    );

    console.log(response);

    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    if (error instanceof EmailJSResponseStatus) {
      console.error("Error sending verification email", error);

      if (error.text.includes("non-browser")) {
        return {
          success: false,
          message:
            "EmailJS server access is disabled. Enable 'Allow EmailJS API for non-browser applications' at https://dashboard.emailjs.com/admin/account/security",
        };
      }

      return { success: false, message: error.text };
    }

    console.error("Error sending verification email", error);
    return { success: false, message: "Failed to send verification email" };
  }
};
