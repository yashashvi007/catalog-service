import createHttpError from "http-errors";

import { NextFunction, RequestHandler, Response, Request } from "express";

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export default function asyncWrapper(requestHandler: AsyncRequestHandler): RequestHandler {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            if(err instanceof Error) {
                return next(createHttpError(500, err.message));
            }
            return next(createHttpError(500, 'An unexpected error occurred'));
        });
    }
}