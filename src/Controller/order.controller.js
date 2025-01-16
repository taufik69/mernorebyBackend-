const orderModel = require("../Model/order.model");
const { apiResponse } = require("../Utils/ApiResponse.js");
const { apiError } = require("../Utils/ApiError.js");
const usermodel = require("../Model/user.model.js");
const cartmodel = require("../Model/cart.model.js");

const placeorder = async (req, res) => {
  try {
    const { userId } = req.user;
    const token = req.headers.authorization.replace("Bearer", "").trim();
    const { customerinfo, paymentinfo } = req.body;
    const { address1, town, district } = customerinfo;
    const { payementmethod } = paymentinfo;
    // validation user input
    if (!address1 || !town || !district || !payementmethod) {
      return res
        .status(401)
        .json(new apiError(false, null, `Order credential Missing`));
    }

    // find the user
    const user = await usermodel.findById(userId);
    // getcat item by user
    const response = await fetch("http://localhost:3000/api/v1/useritem", {
      headers: {
        Authorization: token, // Add the token here
        "Content-Type": "application/json", // Optional: Set content type
      },
    });
    const data = await response.json();
    const { totalamount, totalcartitem } = data?.data;

    if (payementmethod.toLowerCase() == "cash".toLowerCase()) {
      // save the order data into db
      const saveorder = await new orderModel({
        user: userId,
        cartItem: user.cartitem,
        customerinfo,
        paymentinfo,
        subtotal: totalamount,
        totalitem: totalcartitem,
      }).save();
      res.json({ saveorder });
    }else{
        
    }

  } catch (error) {
    return res
      .status(501)
      .json(new apiError(false, null, `from order controller  :  ${error}`));
  }
};

module.exports = { placeorder };
