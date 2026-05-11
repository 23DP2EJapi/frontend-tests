// Latvian and common profanity words list
const BLOCKED_WORDS = [
  // Latvian profanity
  "dirsā", "dirsa", "dirsu", "dirsas",
  "pimpis", "pimpi", "pimpja",
  "kuce", "kuci", "kuce",
  "sūds", "suds", "sūdu", "sudu", "sūdi", "sudi",
  "mauka", "maukas", "mauku",
  "pist", "pistu", "pisis",
  "krievi", "krievu",
  "fuck", "shit", "bitch", "ass", "dick", "pussy",
  "bastard", "whore", "slut", "cunt",
  "pedau", "pedal", "pediņ", "pedin",
  "stulb", "idiots", "idiot", "debīl", "debil",
  "lohs", "lohu", "lohi",
  "pakaļ", "pakal",
  "dirst",
];

export const containsProfanity = (text: string): boolean => {
  const normalized = text.toLowerCase().replace(/[0-9@#$%^&*]/g, "");
  return BLOCKED_WORDS.some((word) => normalized.includes(word));
};

export const profanityMessage = "Vārds satur neatļautus vārdus";
