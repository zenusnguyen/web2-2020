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
  async sendMailVerify(email, otp) {
    try {
      const sendMail = await strapi.plugins["email"].services.email.send({
        to: email,
        from: "web2020hcmus@gmail.com",
        subject: "YELLOW BANKING",
        text: ` You are create new account your OTP code is :${otp}`,
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

  async sendMailNotifyDeposit(email, amount, reamingBalance, accountNumber) {
    try {
      const sendMail = await strapi.plugins["email"].services.email.send({
        to: email,
        from: "web2020hcmus@gmail.com",
        subject: "YELLOW BANKING",
        text: ` Your account ${accountNumber} have just made a  deposit amount :${amount} 
        Your reaming balance is : ${reamingBalance}
  `,
      });

      return sendMail;
    } catch (error) {}
  },

  async sendMailNotifyWithdraw(email, amount, reamingBalance, accountNumber) {
    console.log('email, amount, reamingBalance, accountNumber: ', email, amount, reamingBalance, accountNumber);
   console.log("loggg");
   
    try {
      const sendMail = await strapi.plugins["email"].services.email.send({
        to: email,
        from: "web2020hcmus@gmail.com",
        subject: "YELLOW BANKING",
        text: ` Your account ${accountNumber} have just made a withdraw amount :${amount} 
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
