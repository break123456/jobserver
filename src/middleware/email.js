/** middleware to send emails to user */
import nodemailer from "nodemailer";
import mailgen from "mailgen";
import { mailTemplateType } from "../helpers/constants.js";

export const sendMail = async (email, userName, mailBodyType, userId) => {
  try {
    const mailtransporterConfig = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };

    let transporter = nodemailer.createTransport(mailtransporterConfig);

    let mailGenerator = new mailgen({
      theme: "default",
      product: {
        name: "Simple Academy",
        link: "https://mailgen.js/",
      },
    });

    let mailBody = getMailBody(mailBodyType, userName, userId);

    let mail = mailGenerator.generate(mailBody);

    let message = {
      from: process.env.EMAIL,
      to: email,
      subject: getMailSubject(mailBodyType),
      html: mail,
    };

    await transporter
      .sendMail(message)
      .then(() => {
        return true;
      })
      .catch((error) => {
        return false;
      });
  } catch (err) {
    return false;
  }
};

const getMailBody = (mailBodyType, userName, userId) => {
  switch (mailBodyType) {
    case mailTemplateType.SignUp:
      var signUpEmail = {
        body: {
          name: userName,
          intro:
            "Welcome to Simple Academy! We're very excited to have you on board.",
          action: {
            instructions:
              "You have been successfully registered with us. To get started with Simple Academy, please click here:",
            button: {
              color: "#22BC66", // Optional action button color
              text: "Confirm your account",
              link: `${process.env.CLIENT}authentication/verify/${userId}`,
            },
          },
          outro:
            "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
      };
      return signUpEmail;
      break;
    case mailTemplateType.ResetPassword:
      var resetEmail = {
        body: {
          name: userName,
          intro: "Reset Your Password!",
          action: {
            instructions:
              "To get started with reset password, please click here:",
            button: {
              color: "#22BC66", // Optional action button color
              text: "Confirm your account",
              link: "",
            },
          },
          outro:
            "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
      };
      return resetEmail;
      break;
    case mailTemplateType.ForgotPassword:
      var forgotPassword = {
        body: {
          name: userName,
          intro: "Forgot Your Password!",
          action: {
            instructions:
              "To get started with setting your password, please click here:",
            button: {
              color: "#22BC66", // Optional action button color
              text: "Confirm your account",
              link: "",
            },
          },
          outro:
            "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
      };
      return forgotPassword;
      break;
    case mailTemplateType.UserVerified:
      var forgotPassword = {
        body: {
          name: userName,
          intro: "Account has been verified!",
          action: {
            instructions:
              "Your account has been verified successfully. Please login to the simple academy and continue learning.",
            button: {
              color: "#22BC66", // Optional action button color
              text: "Click here to login",
              link: "",
            },
          },
          outro:
            "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
      };
      return forgotPassword;
      break;
    case mailTemplateType.UserApproved:
      var userApproved = {
        body: {
          name: userName,
          intro: "Account has been Approved!",
          action: {
            instructions:
              "Your account has been approved by admin. Please login to the simple academy and continue learning.",
            button: {
              color: "#22BC66", // Optional action button color
              text: "Click here to login",
              link: process.env.CLIENT,
            },
          },
          outro:
            "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
      };
      return userApproved;
      break;
    case mailTemplateType.PostApproved:
      var postApproved = {
        body: {
          name: userName,
          intro: "Your Post has been Approved!",
          action: {
            instructions:
              "Your post has been approved by admin. Please login to the simple academy and continue learning.",
            button: {
              color: "#22BC66", // Optional action button color
              text: "Click here to login",
              link: process.env.CLIENT,
            },
          },
          outro:
            "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
      };
      return postApproved;
      break;
    case mailTemplateType.UserAccountPendingForApproval:
      var pendingApproval = {
        body: {
          name: userName,
          intro: "Your Account is pending for approval!.",
          action: {
            instructions:
              "Your account is pending for admin approval. Once admin approves your account you will recieve an email of approval. You can continue login into system after that you recieved that email",
            button: {},
          },
          outro:
            "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
      };
      return pendingApproval;
      break;
    case mailTemplateType.UserAccountBlockByAdmin:
      var accountBlocked = {
        body: {
          name: userName,
          intro: "Your Account has been disapproved by admin.",
          action: {
            instructions:
              "Your account has been disapproved by admin. Once admin approves your account you will recieve an email of approval. You can continue login into system after that you recieved that email",
            button: {},
          },
          outro:
            "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
      };
      return accountBlocked;
      break;
    default:
      return {};
  }
};
const getMailSubject = (mailBodyType) => {
  switch (mailBodyType) {
    case mailTemplateType.SignUp:
      return "Sign Up Successfull";
      break;
    case mailTemplateType.ResetPassword:
      return "Reset Password Successfull";
      break;
    case mailTemplateType.ForgotPassword:
      return "Forget Password";
      break;
    case mailTemplateType.UserVerified:
      return "You have been Verified successfully";
    case mailTemplateType.UserApproved:
      return "Account Approved";
      break;
    case mailTemplateType.PostApproved:
      return "Post Approved";
      break;
    case mailTemplateType.UserAccountPendingForApproval:
      return "Account Pending For Approval";
      break;
    case mailTemplateType.UserAccountBlockByAdmin:
      return "Account disapproved by admin";
      break;
  }
};
