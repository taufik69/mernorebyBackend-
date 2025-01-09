const { apiResponse } = require("../Utils/ApiResponse.js");
const { apiError } = require("../Utils/ApiError.js");
const cartModel = require("../Model/cart.model.js");
const userModel = require("../Model/user.model.js");
const addToCart = async (req, res) => {
  try {
    const { user, product, size, color, quantity } = req.body;
    if (!user || !product || !quantity) {
      return res
        .status(400)
        .json(
          new apiError(false, null, "Missing user or product or or quantity")
        );
    }

    // check if the product is already in the cart
    const productInCart = await cartModel.findOne({
      product,
    });
    if (productInCart) {
      return res
        .status(400)
        .json(new apiError(false, null, "Product is already in the cart"));
    }

    // now save the cart information
    const saveCart = await new cartModel({
      user,
      product,
      size,
      color,
      quantity,
    }).save();
    if (!saveCart) {
      return res
        .status(501)
        .json(new apiError(false, null, `Add to cart Failed`));
    }
    // search the user of user database
    const users = await userModel.findOne({ _id: user });
    users.cartitem.push(saveCart._id);
    await users.save();
    return res
      .status(200)
      .json(new apiResponse(true, saveCart, "Add to cart Sucessfull", false));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, null, `From addToCart controller Error :  ${error}`)
      );
  }
};

// cart item in user
const getCartItemuser = async (req, res) => {
  try {
    const user = req.user;
    const allCartItem = await cartModel
      .find({ user: user.userId })
      .populate({
        path: "product",
      })
      .populate({
        path: "user",
        select: "-password -Otp -cartitem -role -isVerified -recoveryEmail",
      });
    if (!allCartItem?.length) {
      return res
        .status(501)
        .json(new apiError(false, null, `Cart Item NOt Found !`));
    }
    let totalItem = 0;
    let totalQuantity = 0;
    allCartItem?.map((item) => {
      const { product, quantity } = item;
      totalItem += parseInt(product.price) * parseInt(quantity);
      totalQuantity += quantity;
    });

    return res.status(200).json(
      new apiResponse(
        true,
        {
          allCartItem: allCartItem,
          totalAmount: totalItem,
          totalQuantity: totalQuantity,
        },

        "Add to cart retrive Sucessfull",
        false
      )
    );
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(
          false,
          null,
          `getCartItemuser addToCart controller Error :  ${error}`
        )
      );
  }
};

// increment quantitiy
const incrementCartItem = async (req, res) => {
  try {
    const { cartid } = req.params;
    const cartItem = await cartModel.findById(cartid);
    cartItem.quantity += 1;
    await cartItem.save();
    return res
      .status(200)
      .json(new apiResponse(true, cartItem, "Add to cart Sucessfull", false));
  } catch (error) {
    return res
      .status(501)
      .json(
        new apiError(false, null, `From increment controller Error :  ${error}`)
      );
  }
};

module.exports = { addToCart, getCartItemuser, incrementCartItem };
