"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  async sendMail(email, otp) {
    try {
      const sendMail = await strapi.plugins["email"].services.email.send({
        to: email,
        from: "web2020hcmus@gmail.com",
        subject: "YELLOW BANKING",
        text: ` You are trading your OTP code is :${otp}`,
      });
    } catch (error) {}
  },
  async sendMailNotifyPlus(email, amount, reamingBalance, accountNumber) {
    try {
      const sendMail = await strapi.plugins["email"].services.email.send({
        to: email,
        from: "web2020hcmus@gmail.com",
        subject: "YELLOW BANKING",
        text: ` Your account ${accountNumber} have just made a wire deposit amount :${amount} 
        Your reaming balance is : ${reamingBalance}
  `,
      });

      return sendMail;
    } catch (error) {}
  },
  async sendMailNotifyMinus(email, amount, reamingBalance, accountNumber) {
    try {
      const sendMail = await strapi.plugins["email"].services.email.send({
        to: email,
        from: "web2020hcmus@gmail.com",
        subject: "YELLOW BANKING",
        text: ` Your account ${accountNumber} have just made a wire transfer amount :${amount} 
              Your reaming balance is : ${reamingBalance}
        `,
      });

      return sendMail;
    } catch (error) {}
  },
};
