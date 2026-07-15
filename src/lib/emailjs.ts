import emailjs from "@emailjs/nodejs";

const publicKey = process.env.EMAILJS_PUBLIC_KEY;
const privateKey = process.env.EMAILJS_PRIVATE_KEY;
const serviceId = process.env.EMAILJS_SERVICE_ID;
const templateId = process.env.EMAILJS_TEMPLATE_ID;

export function getEmailJsConfig() {
  if (!publicKey || !privateKey || !serviceId || !templateId) {
    throw new Error("EmailJS environment variables are not configured");
  }

  return { publicKey, privateKey, serviceId, templateId };
}

export { emailjs };
