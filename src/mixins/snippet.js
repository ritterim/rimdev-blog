export default function snippet(post, max = 50) {
  const x = post.compiledContent() ? post.compiledContent() : post;
  return `${x.split(' ').slice(0, max).join(' ').trim()}...`;
};