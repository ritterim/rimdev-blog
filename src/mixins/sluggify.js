export default function sluggify(text) {
  const newText = text.replace('/', '-');
  return newText.toLowerCase().split(' ').join('-');
}