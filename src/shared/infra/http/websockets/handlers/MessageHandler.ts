import { Server, Socket } from "socket.io";
import { messageEvents } from "../../../../events/messageEvents";

export class MessageHandler {
  public registerSocketHandlers(socket: Socket) {
    const user_id = (socket as any).user_id;

    socket.on("join_conversation", ({ conversation_id }) => {
      const roomName = `conversation:${conversation_id}`;
      socket.join(roomName);
      console.log(`💬 User ${user_id} entrou no chat ${conversation_id}`);
    });

    socket.on("leave_conversation", ({ conversation_id }) => {
      const roomName = `conversation:${conversation_id}`;
      socket.leave(roomName);
    });
  }

  public registerGlobalListeners(io: Server) {
    messageEvents.removeAllListeners("message:created");

    messageEvents.on(
      "message:created",
      ({ message, recipient_id, conversation }) => {
        console.log(`📨 Nova mensagem na conversa ${message.conversation_id}`);
        console.log(`📨 Remetente: ${message.sender?.name || 'Desconhecido'}`);
        console.log(`📨 Destinatário ID: ${recipient_id}`);

        // Emitir mensagem para todos na sala da conversa
        io.to(`conversation:${message.conversation_id}`).emit(
          "new_message",
          {
            id: message.id,
            content: message.content,
            created_at: message.created_at,
            sender_id: message.sender_id || message.sender?.id,
            conversation_id: message.conversation_id,
            read_at: message.read_at,
            sender: message.sender,
          }
        );

        // Enviar notificação apenas para o destinatário (não para quem enviou)
        const productName = conversation?.product?.name || "Produto";
        const senderName = message.sender?.name || "Alguém";

        console.log(`🔔 Enviando notificação para usuário ${recipient_id}`);

        io.to(recipient_id).emit("notification", {
          type: "NEW_MESSAGE",
          title: "Nova Mensagem",
          message: `${senderName} enviou uma mensagem sobre ${productName}`,
          data: {
            message: {
              id: message.id,
              content: message.content,
              created_at: message.created_at,
              sender_id: message.sender_id || message.sender?.id,
              conversation_id: message.conversation_id,
            },
            conversation_id: message.conversation_id,
            sender: message.sender,
            product: conversation?.product,
          },
        });
      }
    );
    messageEvents.on("messages:read", (data) => {
      console.log(
        `👁️ Mensagens lidas na conversa ${data.conversation_id} por ${data.reader_id}`
      );

      io.to(`conversation:${data.conversation_id}`).emit(
        "messages_read_update",
        data
      );
    });
  }
}
