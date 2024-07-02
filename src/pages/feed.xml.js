import rss from '@astrojs/rss';
import { site } from '../data/config.json';

const postImportResult = import.meta.glob('../content/posts/*.md', {
  eager: true,
});
const posts = Object.values(postImportResult)
  .sort((a, b) => a.frontmatter.date.localeCompare(b.frontmatter.date))
  .reverse();

const feed = {
  title: site.site_name,
  description: site.description,
  site: site.baseurl,
  items: posts.map((post) => ({
    link: post.frontmatter.slug,
    title: post.frontmatter.title,
    author: new Intl.ListFormat('en').format(post.frontmatter.authors.map((author) => author)),
    description: post.frontmatter.twitter_text,
    pubDate: new Date(post.frontmatter.date),
  })),
  dest: '/feed.xml',
};

export const GET = () => rss(feed);
