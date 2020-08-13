"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const randomOTP = require("../../../helpers/genaratorOTP");

module.exports = {
  async sendMail(ctx) {
    const otp = randomOTP();
    const data = ctx.request.body;
    try {
      await strapi.query("spend-account").update(
        { card_number: data.card_number },
        {
          otp: otp,
        }
      );
      const sendMail = await strapi.services.email.sendMail(data.email, otp);

      return otp;
    } catch (err) {
      ctx.badRequest("Cannot send email");
    }
  },
};
