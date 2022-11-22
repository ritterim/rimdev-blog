export default function snippet(post) {
  const x = post.compiledContent() ? post.compiledContent() : post;
  return `${x.split(' ').slice(0, 50).join(' ').trim()}...`;
};