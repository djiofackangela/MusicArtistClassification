// backend/shared/email-utils.js

// For this phase, we simulate email by logging to the console.
// If you want real email later, you can plug in nodemailer here.
async function sendEmail(to, subject, text) {
  console.log(" Simulated email:");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("Text:", text);
  // no real sending in this version
  return true;
}

module.exports = { sendEmail };
