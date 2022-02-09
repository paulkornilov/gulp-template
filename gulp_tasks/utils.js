// IMPORTS
import browserSync from "browser-sync";

/**
 *  Detects environment
 */
export const detectEnvironment = () => {
  const envMode = process.argv.includes("--production") ? "production" : "development";
  const isProductionEnvironment = envMode === "production";
  const isDevelopmentEnvironment = envMode === "development";

  isDevelopmentEnvironment ? setDevEnv() : setProdEnv();

  return [envMode, isProductionEnvironment, isDevelopmentEnvironment];
};

/**
 *  Manually sets the env. Needed for some PostCSS plugins.
 */
const setDevEnv = () => (process.env.NODE_ENV = "development");
const setProdEnv = () => (process.env.NODE_ENV = "production");

/**
 * Shows the notification with text when bundler makes some operations.
 *
 * @param notificationText - string with desired text
 */
export const showNotification = (notificationText) => {
  if (detectEnvironment()[2]) {
    browserSync.notify(notificationText);
  }
};
