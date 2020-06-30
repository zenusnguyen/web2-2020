'use strict';
const bcrypt = require("bcrypt");
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
     async hashPassword(password) {
        return bcrypt.hashSync(password, 10);
      } ,
      async verifyPassword(password, passwordHash) {
        return bcrypt.compareSync(password, passwordHash);
      },
     

};
