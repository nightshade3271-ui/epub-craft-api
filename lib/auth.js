/**
 * Proxy Secret Validation for EpubCraft API
 * Enforces authenticated traffic via RapidAPI
 */
module.exports = function validateRapidApiSecret(req) {
  const secret = process.env.RAPIDAPI_PROXY_SECRET;

  // Local development fallback
  if (!secret) {
    return true;
  }

  const incomingSecret =
    req.headers['x-rapidapi-proxy-secret'] ||
    req.headers['x-proxy-secret'] ||
    '';

  return incomingSecret === secret;
};

