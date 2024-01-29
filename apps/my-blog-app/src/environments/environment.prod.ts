export const environment = {
  production: true,
  apiUrl: process.env['APIURL'] as string,
  googleMapApiKey: process.env['GOOGLEMAPKEY'] as string,
  googleRecaptchaSiteKey: process.env['RECAPTCHAKEY'] as string,
};
