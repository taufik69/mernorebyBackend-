const mailChecker = (email = "taufik.cit.bd@gmail.com") => {
  const mailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return mailRegex.test(email);
};

const passwordChecker = (password) => {
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
};

const bdNumberchecker = (number) => {
  const bdPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;

  return bdPhoneRegex.test(number);
};
module.exports = { mailChecker, passwordChecker, bdNumberchecker };
