"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findByAccount(ctx) {
    const id = ctx.query.id;

    const result = [];
    const term_deposit = await strapi.query("term-deposit").findOne({ id: id });

    const interest_rate = await strapi

      .query("interest-rate")
      .findOne({ id: term_deposit.interest_rate_id });

    result.push(term_deposit);
    result.push(interest_rate);
    return result;
  },
};
