"use strict";
// const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
  //   async create(ctx) {
  //     let entity;
  //     if (ctx.is("multipart")) {
  //       const { data, files } = parseMultipartData(ctx);
  //       entity = await strapi.services['spend-account'].create(data, { files });
  //     } else {
  //       entity = await strapi.services['spend-account'].create(ctx.request.body);
  //     }
  //     return sanitizeEntity(entity, { model: strapi.models['spend-account'] });
  //   },
  async findByAccount(ctx) {
    console.log("ctx: ", ctx.request.body);
    const data = await strapi
      .query("spend-account")
      .find({ account_id: ctx.request.body.account_id });

    console.log("data: ", data);
    return data;
  },
};
