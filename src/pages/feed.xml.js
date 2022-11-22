import rss from '@astrojs/rss';
import { site } from '../data/config.json';

const postImportResult = import.meta.glob('../pages/*.md', { eager: true });
const posts = Object.values(postImportResult).sort((a, b) =>
  a.frontmatter.date.localeCompare(b.frontmatter.date)
);

// console.log({
//   title: site.site_name,
//   description: site.description,
//   site: `https://${site.baseurl}`,
//   items: posts.map((post) => ({
//     link: `https://${site.baseurl + post.url}`,
//     title: post.frontmatter.title,
//     pubDate: post.frontmatter.date,
//   })),
// });

// export const get = () =>
//   rss({
//     title: site.site_name,
//     description: site.description,
//     site: site.baseurl,
//     items: posts.map((post) => ({
//       link: post.url,
//       title: post.frontmatter.title,
//       pubDate: post.frontmatter.pubDate,
//     })),
//     customData: `<language>en-us</language>`,
//     dest: '/rss.xml',
//   });
