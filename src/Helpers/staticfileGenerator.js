const staticFileGenerator = (allImage) => {
  const allImageWithDomain = allImage.map((image) => {
    return `${process.env.DOMAIN_NAME}/${image.filename}`;
  });

  return allImageWithDomain;
};

module.exports = { staticFileGenerator };
