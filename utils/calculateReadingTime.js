export default (articleText) => {
  const wordsPerMinute = 200; // Average reading speed in words per minute
  const words = articleText.trim().split(/\s+/);
  const wordCount = words.length;
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

  return readingTimeMinutes;
}