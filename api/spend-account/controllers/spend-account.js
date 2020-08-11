"use strict";
// const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const moment = require("moment");
const ListTermDeposit = [0, 1, 3, 6, 12, 18, 24, 36];
module.exports = {
  async findByOwner(ctx) {
    const data = await strapi.query("spend-account").find({
      account_id: ctx.query.id,
    });

    return data;
  },

  async createSaving(ctx) {
    const reqData = ctx.request.body;
    console.log("reqData: ", reqData);

    const termDeposit = await strapi
      .query("term-deposit")
      .create({
        interest_rate_id: reqData.interest_rate_id,
        maturity_date: moment()
          .add(
            parseInt(ListTermDeposit[parseInt(reqData.interest_rate_id)]),
            "M"
          )
          .toDate(),
        final_settlement_type: reqData.final_settlement_type,
        beneficiary_account: reqData.beneficiary_account,
      })
      .then(async function (data) {
        console.log("data: ", data.id);
        const baseAcount = await strapi.query("spend-account").create({
          account_id: reqData.account_id,
          currency_unit: reqData.currency_unit,
          balance: 0,
          status: "pending",
          card_type: reqData.card_type,
          card_number: reqData.card_number,
          term_deposit_id: data.id,
          created_date: reqData.created_date,
        });
      });

    return "success";
  },

  async findByCardID(ctx) {
    const USER_PERMISSION_PLUGIN = "users-permissions";
    console.log("ctx: ", ctx);
    const data = [];
    const cardData = await strapi.query("spend-account").findOne({
      card_number: ctx.query.id,
    });
    console.log("cardData: ", cardData);
    const OwnerData = await strapi.plugins[
      USER_PERMISSION_PLUGIN
    ].services.user.fetch({ id: cardData.account_id });
    const userInfo = await strapi.query("customer-infor").findOne({
      id: OwnerData.user_info,
    });
    data.push(cardData);
    data.push(userInfo);

    return data;
  },
  async deposit(ctx) {
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
    try {
      const requestData = await ctx.request.body;

      const currentAccount = await strapi
        .query("spend-account")
        .findOne({ card_number: requestData.currentAccount.toString() });
      if (currentAccount.otp != requestData.otp) {
        return ctx.badRequest("invalid otp");
      }
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
          parseInt(currentAccount.balance) - parseInt(requestData.amount),
        beneficiary_bank: requestData.beneficiaryBank || "yellowBank",
      });
      console.log("transfer_log: ", transfer_log);
      // log deposit +
      const deposit_log = await strapi.query("transaction-log").create({
        card_id: beneficiaryAccount.id,
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
