const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeImagesFromPexels(searchTerm) {
  const url = `https://pixabay.com/images/search/?search=${searchTerm}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const imageUrls = [];

    $("img.photo-result-image").each((i, element) => {
      const imageUrl = $(element).attr("src");
      imageUrls.push(imageUrl);
    });

    return imageUrls;
  } catch (error) {
    console.error(error);
    return null;
  }
}

scrapeImagesFromPexels("nature")
  .then((imageUrls) => {
    console.log("imageUrls", imageUrls);
  })
  .catch((error) => {
    console.error(error);
  });
