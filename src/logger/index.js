'use strict';

import winston from 'winston';

const { splat, combine, timestamp, printf, colorize } = winston.format;

// meta param is ensured by splat()
const myFormat = printf(({ timestamp, level, message, meta }) => {
  return `${timestamp} ${level}: ${message} ${
    meta ? JSON.stringify(meta) : ''
  }`;
});

const loggerTransports = [
  {
    type: 'console',
    options: {
      timestamp: true,
      colorize: true
    }
  }
];

const createConsoleTransport = options => {
  return new winston.transports.Console(options);
};

const getLoggerTransports = transports => {
  return transports.map(transport => {
    const { type, options } = transport;
    switch (type) {
      case 'console':
        return createConsoleTransport(options);
    }
  });
};

const createLoggerFactory = transports => {
  return winston.createLogger({
    format: combine(timestamp(), colorize(), splat(), myFormat),
    transports: getLoggerTransports(transports)
  });
};

export default createLoggerFactory(loggerTransports);
