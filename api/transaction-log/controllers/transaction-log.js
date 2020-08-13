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
    const data = await strapi.query("transaction-log").find({
      card_id: ctx.query.id,
    });
    return data;
  },

  async filter(ctx) {
    if (ctx.query.type === "all") {
      ctx.query.type = null;
    }
    const data = await strapi.query("transaction-log").find({
      transaction_type: ctx.query.type,
      created_at_gt: ctx.query.fromDate,
      created_at_lt: ctx.query.toDate,
      account_id: ctx.query.account_id,
    });
    return data;
  },

  async filterByAccount(ctx) {
    if (ctx.query.type === "all") {
      ctx.query.type = null;
    }
    const data = await strapi.query("transaction-log").find({
      transaction_type: ctx.query.type,
      created_at_gt: ctx.query.fromDate,
      created_at_lt: ctx.query.toDate,
      card_id: ctx.query.accountNumber,
    });

    return data;
  },
};
