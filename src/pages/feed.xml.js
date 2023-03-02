import rss from '@astrojs/rss';
import { site } from '../data/config.json';

const postImportResult = import.meta.glob('../content/posts/*.md', { eager: true });
const posts = Object.values(postImportResult)
  .reverse();

const feed = {
  title: site.site_name,
  description: site.description,
  site: site.baseurl,
  items: posts.map((post) => ({
    link: post.frontmatter.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.twitter_text,
    pubDate: new Date(post.frontmatter.date),
  })),
  customData: `<language>en-us</language>`,
  dest: '/feed.xml',
};

export const get = () => rss(feed);