import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

export async function GET(context) {
  const blog = await getCollection("blog");
  return rss({
    title: "lel@nekoweb",
    description: "THE site for lel and gooning",
    site: context.site,
    items: blog.map((post) => ({
      guid: post.data.id,
      title: post.data.title,
      pubDate: post.data.date.toISOString(),
      description: post.data.desc,
      link: `/blogs/${post.id}/`,
    })),
  });
}
