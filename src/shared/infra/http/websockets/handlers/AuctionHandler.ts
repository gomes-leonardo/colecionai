import { Server, Socket } from "socket.io";
import { auctionEvents } from "../../../../events/auctionEvents";

export class AuctionHandler {
  public registerSocketHandlers(socket: Socket) {
    socket.on("join_auction", ({ auction_id }) => {
      socket.join(auction_id);
    });

    socket.on("leave_auction", ({ auction_id }) => {
      socket.leave(auction_id);
    });
  }

  public registerGlobalListeners(io: Server) {
    auctionEvents.removeAllListeners("bid:created");
    auctionEvents.removeAllListeners("bid:outbid");
    auctionEvents.removeAllListeners("bid:received");

    auctionEvents.on("bid:created", (bid) => {
      console.log(
        `📢 Update Público: Lance de ${bid.amount} no leilão ${bid.auction_id}`
      );
      io.to(bid.auction_id).emit("new_bid", bid);
    });

    auctionEvents.on("bid:outbid", (data) => {
      io.to(data.recipient_id).emit("notification", {
        type: "OUTBID",
        title: "Você foi superado!",
        message: `Alguém deu um lance de R$ ${data.newAmount} em ${data.productName}.`,
        data,
      });
    });

    auctionEvents.on("bid:received", (data) => {
      io.to(data.recipient_id).emit("notification", {
        type: "OWNER_NEW_BID",
        title: "Novo Lance Recebido!",
        message: `Seu produto ${data.productName} recebeu um lance de R$ ${data.amount}.`,
        data,
      });
    });
  }
}
