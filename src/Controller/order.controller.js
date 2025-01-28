const orderModel = require("../Model/order.model");
const { apiResponse } = require("../Utils/ApiResponse.js");
const { apiError } = require("../Utils/ApiError.js");
const usermodel = require("../Model/user.model.js");

const invoiceModel = require("../Model/invoice.model.js");
const SSLCommerzPayment = require("sslcommerz-lts");
const crypto = require("crypto");

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.ISLIVE == false; //true or false

const placeorder = async (req, res) => {
  try {
    const { userId } = req.user;
    const token = req.headers.authorization.replace("Bearer", "").trim();
    const { customerinfo, paymentinfo } = req.body;
    const { address1, town, district } = customerinfo;
    const { payementmethod } = paymentinfo;

    // Validate user input
    if (!address1 || !town || !district || !payementmethod) {
      return res
        .status(401)
        .json(new apiError(false, null, `Order credential Missing`));
    }

    // Find the user
    const user = await usermodel.findById(userId);

    // Get cart items by user
    const response = await fetch("http://localhost:3000/api/v1/useritem", {
      headers: {
        Authorization: token, // Add the token here
        "Content-Type": "application/json", // Optional: Set content type
      },
    });
    if (!response.ok) {
      return res
        .status(response.status)
        .json(new apiError(false, null, `Failed to fetch cart items`));
    }
    const data = await response.json();
    const { totalamount, totalcartitem } = data?.data;

    if (payementmethod.toLowerCase() === "cash") {
      // Save the order data into DB
      const saveorder = await new orderModel({
        user: userId,
        cartItem: user.cartitem,
        customerinfo,
        paymentinfo,
        subtotal: totalamount,
        totalitem: totalcartitem,
      }).save();

      // Save the invoice data into DB
      await new invoiceModel({
        user_id: userId,
        cus_details: customerinfo,
        subtotal: totalamount,
        orderId: saveorder._id,
      }).save();

      return res.status(200).json({ saveorder });
    } else if (payementmethod.toLowerCase() === "online") {
      const transiton_id = crypto.randomUUID().split("-")[0];
      const data = {
        total_amount: totalamount,
        currency: "BDT",
        tran_id: transiton_id, // Use unique tran_id for each API call
        success_url: "http://localhost:3000/api/v1/success/" + transiton_id,
        fail_url: "http://localhost:3000/api/v1/fail/" + transiton_id,
        cancel_url: "http://localhost:3000/api/v1/cancel/" + transiton_id,
        ipn_url: "http://localhost:3000/api/v1/ipn/" + transiton_id,
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: "Customer Name",
        cus_email: "customer@example.com",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };

      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const apiResponse = await sslcz.init(data);

      if (!apiResponse) {
        return res
          .status(401)
          .json(new apiError(false, null, `Payment initialization failed`));
      }

      // Save the order data into DB and invoice after successful payment initialization
      const saveorder = await new orderModel({
        user: userId,
        cartItem: user.cartitem,
        customerinfo,
        paymentinfo,
        subtotal: totalamount,
        totalitem: totalcartitem,
      }).save();

      await new invoiceModel({
        user_id: userId,
        cus_details: customerinfo,
        subtotal: totalamount,
        tran_id: transiton_id,
        orderId: saveorder._id,
      }).save();

      return res.status(200).json({ url: apiResponse.GatewayPageURL });
    }

    return res
      .status(400)
      .json(new apiError(false, null, `Invalid payment method`));
  } catch (error) {
    return res
      .status(501)
      .json(new apiError(false, null, `from order controller: ${error}`));
  }
};

module.exports = { placeorder };
