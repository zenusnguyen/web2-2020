"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async changePass(ctx) {
    console.log("ctx: ", ctx);
    let entities;
    // if (ctx.query._q) {
    //   entities = await strapi.services.restaurant.search(ctx.query);
    // } else {
    //   entities = await strapi.services.restaurant.find(ctx.query);
    // }

    // return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.restaurant }));
  },
};
