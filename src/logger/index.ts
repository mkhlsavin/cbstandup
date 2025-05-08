interface Logger {
  info(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}

// We allow console usage in the logger as it's the intended behavior
/* eslint-disable no-console */
const logger: Logger = {
  info(message: string, ...args: unknown[]) {
    console.log(`[INFO] ${message}`, ...args);
  },
  error(message: string, ...args: unknown[]) {
    console.error(`[ERROR] ${message}`, ...args);
  },
  warn(message: string, ...args: unknown[]) {
    console.warn(`[WARN] ${message}`, ...args);
  },
  debug(message: string, ...args: unknown[]) {
    console.debug(`[DEBUG] ${message}`, ...args);
  },
};
/* eslint-enable no-console */

export default logger;
