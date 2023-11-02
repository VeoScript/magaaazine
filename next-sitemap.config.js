const siteUrl = process.env.PROD_URL;
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [`${siteUrl}/sitemap-0.xml`],
  },
};
