import { Request, Response } from "express";

export class LogoutUserController {
 
    async handle(req: Request, res: Response) {
        res.clearCookie("token", {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        return res.status(200).send();
    }
}