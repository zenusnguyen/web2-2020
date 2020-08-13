"use strict";
// const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const moment = require("moment");
const ListTermDeposit = [0, 1, 3, 6, 12, 18, 24, 36];
const _ = require("lodash");
const converToVND = (amout) => {
  return amout * 25000;
};

const converToUSD = (amout) => {
  return amout / 25000;
};
const USER_PERMISSION_PLUGIN = "users-permissions";
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
        origin_balance: 0,
      })
      .then(async function (data) {
        const baseAcount = await strapi.query("spend-account").create({
          account_id: reqData.account_id,
          currency_unit: reqData.currency_unit,
          balance: 0,
          status: "active",
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

    const data = [];
    const cardData = await strapi.query("spend-account").findOne({
      card_number: ctx.query.id,
    });
    if (cardData === null) {
      return ctx.badRequest("beneficiary account invalid");
    }
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
    const requestData = ctx.request.body.data;
    console.log("requestData: ", requestData);
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
    if (depositAccount.card_type === "saving") {
      const term_deposit = await strapi
        .query("term-deposit")
        .findOne({ id: depositAccount.term_deposit_id });

      const mappingBalance = await strapi.query("term-deposit").update(
        { id: depositAccount.term_deposit_id },
        {
          origin_balance:
            parseInt(depositAccount.balance) + parseInt(requestData.amount),
        }
      );
    }
    // log deposit +
    const deposit_log = await strapi.query("transaction-log").create({
      unit: depositAccount.currency_unit,
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
      const limitedTable = await strapi.query("spend-account-type").find();
      console.log("limitedTable: ", limitedTable);
      const requestData = await ctx.request.body;
      let beneficiaryAmount = requestData.amount;
      let vndAmount = requestData.amount;

      const currentAccount = await strapi
        .query("spend-account")
        .findOne({ card_number: requestData.currentAccount.toString() });

      if (currentAccount.currency_unit != "VND") {
        vndAmount = converToVND(requestData.amount);
      }
      if (currentAccount.otp != requestData.otp) {
        console.log("invalid otp: ");
        return ctx.badRequest("invalid otp");
      }
      console.log("currentAccount: ", currentAccount);
      const currentUser = await strapi.plugins[
        USER_PERMISSION_PLUGIN
      ].services.user.fetch({ id: currentAccount.account_id });
      console.log("currentUser: ", currentUser);

      const limited = limitedTable[currentAccount.spend_type - 1];
      console.log("limited: ", limited);
      const currentDate = new Date(
        new Date().getFullYear().toString(),
        new Date().getMonth().toString(),
        new Date().getDate().toString(),
        "0",
        "0",
        "0"
      );
      const todayTransaction = await strapi.query("transaction-log").find({
        transaction_type: "transfer",
        created_at_gt: currentDate,
        card_id: currentAccount.id,
      });

      let totalTransaction = 0;
      _.forEach(todayTransaction, (item) => {
        totalTransaction += item.amount;
      });
      if (currentAccount.currency_unit != "VND") {
        totalTransaction = converToVND(totalTransaction);
        console.log("totalTransaction: ", totalTransaction);
      }

      if (
        limited.limited_amount_per_transaction < vndAmount ||
        totalTransaction + vndAmount > limited.limited_amount_per_day
      ) {
        console.log("Limted Transaction");
        // return ctx.throw(400, "Limted Transaction");
        return ctx.badRequest("Limted Transaction");
      }
      const beneficiaryAccount = await strapi.query("spend-account").findOne({
        card_number: requestData.beneficiaryAccount.toString(),
      });
      console.log("currentUser: ", currentUser);
      const beneficiaryUser = await strapi.plugins[
        USER_PERMISSION_PLUGIN
      ].services.user.fetchAll({ id: beneficiaryAccount.account_id });

      console.log("beneficiaryUser: ", beneficiaryUser);

      if (beneficiaryAccount == null) {
        return ctx.badRequest("Beneficiary account not found");
      }

      if (beneficiaryAccount.currency_unit != currentAccount.currentAccount) {
        if (beneficiaryAccount.currency_unit == "USD") {
          beneficiaryAmount = converToUSD(requestData.amount);
        } else {
          beneficiaryAmount = converToVND(requestData.amount);
        }
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
            parseInt(beneficiaryAccount.balance) + parseInt(beneficiaryAmount),
        }
      );

      // log transfer -
      const transfer_log = await strapi.query("transaction-log").create({
        unit: currentAccount.currency_unit,
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
        unit: beneficiaryAccount.currency_unit,
        card_id: beneficiaryAccount.id,
        amount: beneficiaryAmount,
        account_id: beneficiaryAccount.account_id,
        transaction_type: "deposit",
        from_account: requestData.currentAccount,
        beneficiary_account: requestData.beneficiaryAccount,
        remark: requestData.remark,
        remaining_balance:
          parseInt(beneficiaryAccount.balance) + parseInt(beneficiaryAmount),
        beneficiary_bank: requestData.beneficiaryBank || "yellowBank",
      });
    } catch (error) {
      return ctx.badRequest(error.message);
    }
    return "success";
  },
};
