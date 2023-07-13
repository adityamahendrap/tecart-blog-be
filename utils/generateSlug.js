export default (str) => {
  const trimmedStr = str.trim();
  const lowercasedStr = trimmedStr.toLowerCase();
  const slug = lowercasedStr.replace(/[^a-z0-9]+/g, '-');
  const cleanedSlug = slug.replace(/-+/g, '-');
  const finalSlug = cleanedSlug.replace(/^-+|-+$/g, '');

  return finalSlug;
}
