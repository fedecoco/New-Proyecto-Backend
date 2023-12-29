import winston, { level } from "winston";

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({level: "debug"}),
    ]
});

export const addLogger = (req, res, next) => {
    req.logger = logger;
    next();

}