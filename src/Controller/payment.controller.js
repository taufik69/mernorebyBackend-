const { apiResponse } = require("../Utils/ApiResponse.js");
const { apiError } = require("../Utils/ApiError.js");
const invoiceModel = require("../Model/invoice.model.js");
const orderModel = require("../Model/order.model");

const sucessPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceModel.findOne({ tran_id: id });
    if (!invoice) {
      return res.json(new apiError(false, null, `Order not found`));
    }

    invoice.payment_status = "Success";
    await invoice.save();

    // now find the order db and update the payment status
    const order = await orderModel.findById(invoice.orderId);
    order.paymentinfo.isPaid = true;
    await order.save();
    return res.redirect(`${process.env.FRONTEND_DOMAIN}/Success`);
  } catch (error) {
    return res.json(new apiError(false, null, `Payment Fail`));
  }
};
const failPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceModel.findOne({ tran_id: id });
    if (!invoice) {
      return res.json(new apiError(false, null, `Order not found`));
    }

    invoice.payment_status = "Failed";
    await invoice.save();

    // now find the order db and update the payment status
    const order = await orderModel.findById(invoice.orderId);
    order.paymentinfo.isPaid = false;
    await order.save();
    return res.redirect(`${process.env.FRONTEND_DOMAIN}/failed`);
  } catch (error) {
    return res.json(new apiError(false, null, `Payment Fail`));
  }
};

// cancle payment

const canclePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceModel.findOne({ tran_id: id });
    if (!invoice) {
      return res.json(new apiError(false, null, `Order not found`));
    }

    invoice.payment_status = "canceled";
    await invoice.save();

    // now find the order db and update the payment status
    const order = await orderModel.findById(invoice.orderId);
    order.paymentinfo.isPaid = false;
    await order.save();
    return res.redirect(`${process.env.FRONTEND_DOMAIN}/cancel`);
  } catch (error) {
    return res.json(new apiError(false, null, `Payment Fail`));
  }
};

const ipn = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await invoice.findOne({ tran_id: id });
    if (!invoice) {
      return res.json(new apiError(false, null, `Order not found`));
    }
    invoice.payment_status = "Success";
    await invoice.save();
    // now find the order db and update the payment status
    const order = await orderModel.findById(invoice.orderId);
    order.paymentinfo.isPaid = true;
    await order.save();

    res.redirect(`http://localhost:5173/cancel`);
  } catch (error) {
    return res.json(new apiError(false, null, `Payment Fail`));
  }
};
module.exports = { sucessPayment, failPayment, canclePayment };
