"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findByOwner(ctx) {
    const data = await strapi.query("transaction-log").find({
      account_id: ctx.query.account_id,
    });

    return data;
  },
  async findByOwnerAccount(ctx) {
    console.log('ctx: ', ctx);
    const data = await strapi.query("transaction-log").find({
      card_id: ctx.query.card_id,
    });
    return data;
  },
};
