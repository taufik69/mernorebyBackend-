const aleaRNGFactory = require("number-generator/lib/aleaRNGFactory");

const numberGenerator = async () => {
  const generator1 = await aleaRNGFactory(new Date());
  console.log(generator1.uInt32());

  return generator1.uInt32();
};
module.exports = { numberGenerator };
