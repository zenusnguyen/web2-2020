"use strict";
// const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
  async findByOwner(ctx) {
    console.log("ctx: ", ctx.query.id);
    const data = await strapi
      .query("spend-account")
      .find({ account_id: ctx.query.id });

    return data;
  },
  async findByCardID(ctx) {
    console.log("ctx: ", ctx.query.id);
    const data = await strapi
      .query("spend-account")
      .find({ account_id: ctx.query.id });

    return data;
  },
  async transferIntra(ctx) {
    console.log("ctx: ", ctx.request.body);
    const data = ctx.request.body;

    const currentAccount = await strapi
      .query("spend-account")
      .findOne({ card_number: data.currentAccount });

    const beneficiaryAccount = await strapi
      .query("spend-account")
      .findOne({ card_number: data.beneficiaryAccount });

    await strapi
      .query("spend-account")
      .update(
        { card_number: data.currentAccount },
        { balance: parseInt(currentAccount.balance) - parseInt(data.amount) }
      );

    await strapi
      .query("spend-account")
      .update(
        { card_number: data.beneficiaryAccount },
        { balance: parseInt(beneficiaryAccount.balance) + parseInt(data.amount) }
      );
    const result = "asdas ";
    console.log("result: ", result);
    // const data = await strapi
    //   .query("spend-account")
    //   .find({ account_id: ctx.query.id });

    // return data;
    return result;
  },
};
