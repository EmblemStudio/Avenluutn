export function twitterSearchLink(text: string): string {
  const encodedText = encodeURIComponent(text)
  return `https://twitter.com/search?q=${encodedText}&src=typed_query`
}