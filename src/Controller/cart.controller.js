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
module.exports = { addToCart };
