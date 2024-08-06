export const generateRandomUsername = (): string => {
  const adjectives = ["Quick", "Bright", "Clever", "Swift", "Brave", "Calm"];
  const nouns = ["Fox", "Hawk", "Lion", "Wolf", "Eagle", "Tiger"];
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);

  return `${randomAdjective}${randomNoun}${randomNumber}`;
};
