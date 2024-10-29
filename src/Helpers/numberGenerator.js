const aleaRNGFactory = require("number-generator/lib/aleaRNGFactory");

const numberGenerator = async () => {
  const generator1 = await aleaRNGFactory(new Date());

  return generator1.uInt32().toString().slice(0, 4);
};
module.exports = { numberGenerator };
