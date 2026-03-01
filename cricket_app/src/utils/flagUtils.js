/**
 * Returns the country flag image URL for the given team name.
 */
export const getCountryFlagImageUrl = (team) => {
  switch (team) {
    case "Bangladesh":
      return "https://www.countryflags.com/wp-content/uploads/flag-jpg-xl-14-2048x1229.jpg";
    case "India":
      return "https://www.countryflags.com/wp-content/uploads/india-flag-png-large.png";
    case "Pakistan":
      return "https://www.countryflags.com/wp-content/uploads/pakistan-flag-png-large.png";
    case "Australia":
      return "https://www.countryflags.com/wp-content/uploads/flag-jpg-xl-9-2048x1024.jpg";
    case "England":
      return "https://www.countryflags.com/wp-content/uploads/united-kingdom-flag-png-large.png";
    case "Sri Lanka":
      return "https://www.countryflags.com/wp-content/uploads/sri-lanka-flag-png-large.png";
    default:
      return "";
  }
};

/**
 * Returns the 3-letter abbreviation for the given team name.
 */
export const getTeamAbbr = (team) => {
  const abbrs = {
    Bangladesh: "BAN",
    India: "IND",
    Pakistan: "PAK",
    Australia: "AUS",
    England: "ENG",
    "Sri Lanka": "SL",
  };
  return abbrs[team] || team;
};

/**
 * List of all available teams.
 */
export const TEAMS = [
  "Bangladesh",
  "India",
  "Pakistan",
  "Australia",
  "England",
  "Sri Lanka",
];

/**
 * API base URL for the Cricket server.
 */
export const API_BASE = "https://cricket-server-kxl8.onrender.com";
