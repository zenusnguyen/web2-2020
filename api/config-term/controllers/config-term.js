"use strict";
const _ = require("lodash");
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async updateTerm(ctx) {
    const data = ctx.request.body.spendData;

    _.forEach(data, async (item) => {
      const result = await strapi.query("spend-account-type").update(
        { id: item.id },
        {
          limited_amount_per_transaction: parseFloat(
            item.limited_amount_per_transaction
          ),
          limited_amount_per_day: parseFloat(item.limited_amount_per_day),
        }
      );
    });

    return "success";
  },
};
