"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */


module.exports = {
  async updateTerm(ctx) {
    console.log('ctx: ', ctx.request.body);
   
    return "success";
  },
};
