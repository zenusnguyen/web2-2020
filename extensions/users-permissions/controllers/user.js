"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const USER_PERMISSION_PLUGIN = "users-permissions";
module.exports = {
  async findUnActive(activectx) {
    const data = await strapi.plugins[
      USER_PERMISSION_PLUGIN
    ].services.user.fetchAll({ status_in: ["pending", "reject"] });

    return data;
  },
  async findActive(activectx) {
    const data = await strapi.plugins[
      USER_PERMISSION_PLUGIN
    ].services.user.fetchAll({ status_in: ["active", "block"] });

    return data;
  },
  async blockUser(ctx) {
    
  },
};
