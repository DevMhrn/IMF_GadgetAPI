import chalk from 'chalk';

const logger = {
  info: (message, data = '') => {
    console.log(chalk.blue(`[INFO] ${message}`), data);
  },
  error: (message, error) => {
    console.error(chalk.red(`[ERROR] ${message}`), error);
  },
  warn: (message, data = '') => {
    console.warn(chalk.yellow(`[WARN] ${message}`), data);
  },
  debug: (message, data = '') => {
    console.debug(chalk.green(`[DEBUG] ${message}`), data);
  }
};

export default logger;
