"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  async sendMail(email, otp) {
    console.log("email,otp: ", email, otp);
    try {
      const sendMail = await strapi.plugins["email"].services.email.send({
        to: email,
        from: "web2020hcmus@gmail.com",
        subject: "Hello world",
        text: `your otp is :${otp}`,
      });
      console.log("sendMail: ", sendMail);
    } catch (error) {
      console.log("error: ", error);
    }
  },
};
