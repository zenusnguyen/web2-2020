module.exports = ({ env }) => ({
  email: {
    provider: "nodemailer",
    providerOptions: {
      service: 'gmail',
      host: env("SMTP_HOST", "smtp.gmail.com"),
      port: env("SMTP_PORT", 587),
      // auth: {
      //   user: env('SMTP_USERNAME')||"zenusnguyen@gmail.com",
      //   pass: env('SMTP_PASSWORD')||"31011998aA",
      // }
      // secure: true,
      auth: {
        user: "web2020hcmus@gmail.com",
        pass: "31011998aA",
      },
      // ... any custom nodemailer options
    },
    settings: {
      defaultFrom: "web2020hcmus@gmail.com",
      defaultReplyTo: "web2020hcmus@gmail.com",
    },
  },
});
