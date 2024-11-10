const fs = require("fs");
const path = require("path");
// const { format } = require("date-fns"); // Optional: for better date formatting

// Base URL of your website
const BASE_URL = "https://lel.nekoweb.org";
// Root directory of your website files
const DIRECTORY = "D:/Programming/Lelillumina.github.io/";

// Function to recursively get all HTML files and their last modified times
function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    // Skip the node_modules directory
    if (file === "node_modules") {
      return;
    }

    if (stats.isDirectory()) {
      getFiles(filePath, fileList);
    } else if (file.endsWith(".html") || file.endsWith(".htm")) {
      fileList.push({
        path: filePath,
        lastModified: stats.mtime,
      });
    }
  });

  return fileList;
}

// Function to generate sitemap XML content
function generateSitemap(files) {
  let sitemap = "<?xml version='1.0' encoding='UTF-8'?>";
  sitemap += "<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>\n";

  files.forEach((file) => {
    const relativePath = path
      .relative(DIRECTORY, file.path)
      .replace(/\\/g, "/");
    const url = `${BASE_URL}/${encodeURI(relativePath)}`;
    const lastMod = file.lastModified.toISOString().slice(0, 10); // Format date as YYYY-MM-DD

    sitemap += "  <url>\n";
    sitemap += `    <loc>${url}</loc>\n`;
    sitemap += `    <lastmod>${lastMod}</lastmod>\n`;
    sitemap += "    <changefreq>weekly</changefreq>\n"; // Adjust as needed
    sitemap += "    <priority>0.5</priority>\n"; // Adjust as needed
    sitemap += "  </url>\n";
  });

  sitemap += "</urlset>\n";
  return sitemap;
}

// Generate the sitemap
const files = getFiles(DIRECTORY);
const sitemapContent = generateSitemap(files);

// Write the sitemap to a file
fs.writeFileSync(path.join(DIRECTORY, "sitemap.xml"), sitemapContent);
console.log("Sitemap generated at sitemap.xml");
