'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async auth(ctx){
        var userName = ctx.request.body.username;
        var password = ctx.request.body.password;
        var user  = await strapi.services["customer-accounts"].findOne({user_name: userName});
        var compare = await strapi.services["customer-accounts"].verifyPassword(password,user.password);
        if(!user || !compare)
        {
            ctx.status(401);
        }
        else
        {
            ctx.send({
                status: 200,
                result : user

           });
        }
    }

};
