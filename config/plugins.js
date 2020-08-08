module.exports = ({ env }) => ({
  email: {
    provider: "nodemailer",
    providerOptions: {
      host: env("SMTP_HOST", "smtp.gmail.com"),
      port: env("SMTP_PORT", 587),
      // auth: {
      //   user: env('SMTP_USERNAME')||"zenusnguyen@gmail.com",
      //   pass: env('SMTP_PASSWORD')||"31011998aA",
      // }
      auth: {
        user: "zenusnguyen@gmail.com",
        pass: "31011998aA",
      },
      // ... any custom nodemailer options
    },
    settings: {
      defaultFrom: "hello@example.com",
      defaultReplyTo: "hello@example.com",
    },
  },
});
