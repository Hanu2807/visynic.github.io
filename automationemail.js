import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm";

const EMAILJS_CONFIG = {
  publicKey: "tdYlntZxC_AnctK8L",
  serviceId: "service_z0byoo6",
  approvalTemplateId: "template_h1evcd5",
  fromName: "VISYNIC"
};

let emailJsInitialized = false;

function getConfig() {
  const runtime = typeof window !== "undefined" ? window.EMAILJS_CONFIG || {} : {};
  return {
    publicKey: runtime.publicKey || EMAILJS_CONFIG.publicKey,
    serviceId: runtime.serviceId || EMAILJS_CONFIG.serviceId,
    approvalTemplateId: runtime.approvalTemplateId || EMAILJS_CONFIG.approvalTemplateId,
    fromName: runtime.fromName || EMAILJS_CONFIG.fromName
  };
}

export function isEmailJsReady() {
  const cfg = getConfig();
  return Boolean(cfg.publicKey && cfg.serviceId && cfg.approvalTemplateId);
}

function initEmailJs() {
  if (emailJsInitialized) return;
  const cfg = getConfig();
  emailjs.init({ publicKey: cfg.publicKey });
  emailJsInitialized = true;
}

export async function sendApprovalPinEmail({ toEmail, toName, pin, approvedBy }) {
  if (!toEmail) return { ok: false, reason: "missing-recipient" };
  if (!isEmailJsReady()) return { ok: false, reason: "not-configured" };

  initEmailJs();
  const cfg = getConfig();

  try {
    await emailjs.send(cfg.serviceId, cfg.approvalTemplateId, {
      // Generic names
      to_email: toEmail,
      to_name: toName || "Team Member",
      team_pin: String(pin || ""),
      approved_by: approvedBy || "VISYNIC Admin",
      from_name: cfg.fromName,
      // Backward-compatible names if your template uses these
      email: toEmail,
      name: toName || "Team Member",
      pin: String(pin || "")
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: "send-failed",
      error: error?.text || error?.message || String(error)
    };
  }
}
