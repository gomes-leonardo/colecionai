import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateBidUseCase } from "./CreateBidUseCase";
import { z } from "zod";
import { bidSchema } from "../../../schemas/bidSchema";
import { io } from "../../../shared/infra/http/server";

export class CreateBidController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;

    const { amount, auction_id } = req.body;

    const createBidUseCase = container.resolve(CreateBidUseCase);

    const bid = await createBidUseCase.execute({
      auction_id,
      user_id,
      amount,
    });

    io.to(auction_id).emit("new_bid", {
      amount: bid.amount,
      user: (bid as any).user,
      created_at: bid.created_at,
      auction_id: auction_id,
    });

    return res.status(201).json(bid);
  }
}
