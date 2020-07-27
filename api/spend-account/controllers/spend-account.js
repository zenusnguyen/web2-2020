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
  async transferIntra(ctx) {
    // console.log("ctx: ", ctx.request.body);
    try {
      const requestData = await ctx.request.body.data;

      const currentAccount = await strapi
        .query("spend-account")
        .findOne({ card_number: requestData.currentAccount.toString() });

      const beneficiaryAccount = await strapi.query("spend-account").findOne({
        card_number: requestData.beneficiaryAccount.toString(),
      });

      if (beneficiaryAccount == null) {
        return ctx.badRequest("beneficiaryAccount not found");
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
      const transfer_log = await strapi.query("transfer-log").create({
        source_account: requestData.currentAccount,
        beneficiary_account: requestData.beneficiaryAccount,
        remark: requestData.remark,
        beneficiary_bank: requestData.beneficiaryBank || "yellowBank",
      });

      const transaction_transfer = await strapi
        .query("transaction-log")
        .create({
          transaction_type: "transfer",
          amount: requestData.amount,
          account_id: requestData.currentAccount,
          log_detail: transfer_log.id,
        });

      // log transfer +
      const deposit_log = await strapi.query("deposit-log").create({
        fromAccount: requestData.currentAccount,
        fromBank: requestData.sourceBank || "yellowBank",
        toAccount: requestData.beneficiaryAccount,
        toBank: requestData.beneficiaryBank || "yellowBank",
      });
      // console.log("deposit_log: ", deposit_log);
      const transaction_deposit = await strapi.query("transaction-log").create({
        transaction_type: "deposit",
        amount: requestData.amount,
        account_id: requestData.beneficiaryAccount,
        log_detail: deposit_log.id,
      });
      // console.log("transaction_deposit: ", transaction_deposit);
    } catch (error) {
      return ctx.badRequest(error.message);
    }
    return "success";
  },
};
