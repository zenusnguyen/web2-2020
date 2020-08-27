module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  // tslint:disable-next-line

  // "0 1 * * 1": async () => {
  //   const SavingList = strapi
  //     .query("spend-account")
  //     .find({ card_type: "saving" });
  // },

  "*0 1 * * 1": async () => {
    const RateTable = await strapi.query("interest-rate").find();

    const ListSaving = await strapi
      .query("spend-account")
      .find({ card_type: "saving", status: "active" });

    ListSaving.forEach(async (saving) => {
      const rate = await strapi

        .query("term-deposit")
        .findOne({ id: saving.term_deposit_id });

      const period = RateTable[rate.interest_rate_id - 1];

      const Plus = await strapi.query("spend-account").update(
        { id: saving.id },
        {
          balance:
            saving.balance +
            (rate.origin_balance * (period.interest_rate / 100)) /
              (period.period * 30),
        }
      );
    });
  },

  // renew savingAccount
  "*0 2 * * 1": async () => {
    const RateTable = await strapi.query("interest-rate").find();

    const ListSaving = await strapi
      .query("spend-account")
      .find({ card_type: "saving", status: "active" });

    ListSaving.forEach(async (saving) => {
      const rate = await strapi
        .query("term-deposit")
        .findOne({ id: saving.term_deposit_id });
      if (
        rate.final_settlement_type === false &&
        ((new Date().getFullYear === new Date(rate.maturity_date).getFullYear &&
          new Date().getMonth === new Date(rate.maturity_date).getMonth) ||
          new date.getDate() === new date.getDate(rate.maturity_date))
      ) {
        const newMaturityDate = new Date(
          moment(rate.maturity_date).add(
            parseInt(RateTable[rate.interest_rate_id - 1])
          ),
          "M"
        );
        const renewDate = await strapi
          .query("term-deposit")
          .update({ id: rate.id }, { maturity_date: newMaturityDate });

        const renewOriginMoney = await strapi
          .query("term-deposit")
          .update({ id: rate.id }, { origin_balance: saving.balance });
      }
    });
  },

  // transfer to beneficiaryAccount

  "*0 3 * * 1": async () => {
    const ListSaving = await strapi
      .query("spend-account")
      .find({ card_type: "saving" });

    ListSaving.forEach(async (saving) => {
      const rate = await strapi
        .query("term-deposit")
        .findOne({ id: saving.term_deposit_id });
      if (
        rate.final_settlement_type === true &&
        ((new Date().getFullYear === new Date(rate.maturity_date).getFullYear &&
          new Date().getMonth === new Date(rate.maturity_date).getMonth) ||
          new date.getDate() === new date.getDate(rate.maturity_date))
      ) {
        const beneficiaryAccount = await strapi
          .query("spend-account")
          .findOne({ card_number: rate.beneficiary_account, status: "active" });
        const transfer = await strapi
          .query("spend-account")
          .update(
            { card_number: rate.beneficiary_account },
            { balance: beneficiaryAccount + rate.balance }
          );

        const closeAccount = await strapi
          .query("spend-account")
          .update(
            { id: saving.id },
            { status: "close", closed_date: new Date() }
          );
      }
    });
  },
};
