"use strict";
/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#cron-tasks
 */

// const rateTable = strapi.query("interest-rate").find();

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

  "*/1 * * * *": async () => {
    const RateTable = await strapi.query("interest-rate").find();

    const ListSaving = await strapi
      .query("spend-account")
      .find({ card_type: "saving" });

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

      console.log("Plus: ", Plus);
    });

    console.log("1 minute later");
  },
};
