"use strict";
// const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
  async findByOwner(ctx) {
    console.log("ctx: ", ctx.query.id);
    const data = await strapi.query("spend-account").find({
      account_id: ctx.query.id,
    });

    return data;
  },
  async findByCardID(ctx) {
    console.log("ctx: ", ctx.query.id);
    const data = await strapi.query("spend-account").find({
      account_id: ctx.query.id,
    });

    return data;
  },
  async deposit(ctx) {
    try {
      const sendMail = await strapi.plugins["email"].services.email.send({
        to: "anhnguyenviet998@gmail.com",
        from: "zenusnguyen@gmail.com",
        subject: "Hello world",
        text: "Hello world",
        html: `<h4>Hello world</h4>`,
      });
      console.log("sendMail: ", sendMail);
    } catch (error) {
      console.log("error: ", error);
    }
    const requestData = ctx.request.body;
    const depositAccount = await strapi
      .query("spend-account")
      .findOne({ card_number: requestData.beneficiaryAccount });

    const depositResult = await strapi.query("spend-account").update(
      {
        card_number: requestData.beneficiaryAccount,
      },
      {
        balance:
          parseInt(depositAccount.balance) + parseInt(requestData.amount),
      }
    );

    // log deposit +
    const deposit_log = await strapi.query("transaction-log").create({
      card_id: depositAccount.id,
      amount: requestData.amount,
      account_id: depositAccount.account_id,
      transaction_type: "deposit",
      from_account: "admin",
      beneficiary_account: requestData.beneficiaryAccount,
      remark: requestData.remark,
      remaining_balance:
        parseInt(depositAccount.balance) + parseInt(requestData.amount),
      beneficiary_bank: requestData.beneficiaryBank || "yellowBank",
    });

    return "success";
  },
  async transferIntra(ctx) {
    // console.log("ctx: ", ctx.request.body);
    try {
      const requestData = await ctx.request.body;

      const currentAccount = await strapi
        .query("spend-account")
        .findOne({ card_number: requestData.currentAccount.toString() });

      const beneficiaryAccount = await strapi.query("spend-account").findOne({
        card_number: requestData.beneficiaryAccount.toString(),
      });

      if (beneficiaryAccount == null) {
        return ctx.badRequest("Beneficiary account not found");
      }

      const transfer = await strapi.query("spend-account").update(
        { id: currentAccount.id },
        {
          balance:
            parseInt(currentAccount.balance) - parseInt(requestData.amount),
        }
      );

      const deposit = await strapi.query("spend-account").update(
        { id: beneficiaryAccount.id },
        {
          balance:
            parseInt(beneficiaryAccount.balance) + parseInt(requestData.amount),
        }
      );

      // log transfer -
      const transfer_log = await strapi.query("transaction-log").create({
        card_id: currentAccount.id,
        amount: requestData.amount,
        account_id: currentAccount.account_id,
        transaction_type: "transfer",
        from_account: requestData.currentAccount,
        beneficiary_account: requestData.beneficiaryAccount,
        remark: requestData.remark,
        remaining_balance:
          parseInt(currentAccount.balance) + parseInt(requestData.amount),
        beneficiary_bank: requestData.beneficiaryBank || "yellowBank",
      });
      console.log("transfer_log: ", transfer_log);
      // log deposit +
      const deposit_log = await strapi.query("transaction-log").create({
        card_id: currentAccount.id,
        amount: requestData.amount,
        account_id: beneficiaryAccount.account_id,
        transaction_type: "deposit",
        from_account: requestData.currentAccount,
        beneficiary_account: requestData.beneficiaryAccount,
        remark: requestData.remark,
        remaining_balance:
          parseInt(beneficiaryAccount.balance) + parseInt(requestData.amount),
        beneficiary_bank: requestData.beneficiaryBank || "yellowBank",
      });
      console.log("deposit_log: ", deposit_log);
    } catch (error) {
      return ctx.badRequest(error.message);
    }
    return "success";
  },
};
