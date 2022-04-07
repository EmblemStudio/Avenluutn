export function twitterVoteLink(matchText: string, option: string, url: string): string {
  const encodedText = encodeURIComponent(`|| ${matchText} ||
I say "${option}," because...
${url}`)
  return `https://twitter.com/intent/tweet?text=${encodedText}`
}