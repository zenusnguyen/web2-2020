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
    console.log("ctx: ", ctx.request.body);
    try {
      const data = ctx.request.body;

      const currentAccount = await strapi.query("spend-account").findOne({
        card_number: data.currentAccount,
      });
      // console.log("currentAccount: ", currentAccount);
      const beneficiaryAccount = await strapi.query("spend-account").findOne({
        card_number: data.beneficiaryAccount,
      });
      // console.log("beneficiaryAccount: ", beneficiaryAccount);
      const transfer = await strapi.query("spend-account").update(
        { id: currentAccount.id },
        {
          balance: parseInt(currentAccount.balance) - parseInt(data.amount),
        }
      );

      const deposit = await strapi.query("spend-account").update(
        { id: beneficiaryAccount.id },
        {
          balance: parseInt(beneficiaryAccount.balance) + parseInt(data.amount),
        }
      );
      console.log("deposit: ", deposit);
      // console.log("transfer: ", transfer);
      // log transfer
      const transfer_log = await strapi.query("transfer-log").create({
        source_account: data.currentAccount,
        beneficiary_account: data.beneficiaryAccount,
        remark: data.remark,
        beneficiary_bank: data.beneficiaryBank || "yellowBank",
      });
      console.log("transfer_log: ", transfer_log);
      const transaction_transfer = await strapi
        .query("transaction-log")
        .create({
          transaction_type: "transfer",
          amount: data.amount,
          account_id: data.currentAccount,
          log_detail: transfer_log.id,
        });
      console.log("transaction_transfer: ", transaction_transfer);
      // log deposit -
      const deposit_log = await strapi.query("deposit-log").create({
        fromAccount: data.currentAccount,
        fromBank: data.sourceBank || "yellowBank",
        toAccount: data.beneficiaryAccount,
        toBank: data.beneficiaryBank || "yellowBank",
      });
      console.log("deposit_log: ", deposit_log);
      const transaction_deposit = await strapi.query("transaction-log").create({
        transaction_type: "deposit",
        amount: data.amount,
        account_id: data.beneficiaryAccount,
        log_detail: deposit_log.id,
      });
      console.log("transaction_deposit: ", transaction_deposit);
    } catch (error) {
      console.log(error);
    }
    const result = "asdas ";

    // const data = await strapi
    //   .query("spend-account")
    //   .find({ account_id: ctx.query.id });

    // return data;
    return result;
  },
};
