'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    lifecycles: {
        async beforeCreate(data) {
          const passwordHashed = await strapi.services["customer-accounts"].hashPassword(data.password);
          data.password = passwordHashed;
        },
      },
};
