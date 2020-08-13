"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findCMND(ctx) {
    const identificationNumber = await ctx.query.identificationNumber;
    console.log("identificationNumber: ", identificationNumber);

    const data = await strapi.query("customer-infor").findOne({
      identificationNumber: identificationNumber,
    });

    return data || [];
  },
};
