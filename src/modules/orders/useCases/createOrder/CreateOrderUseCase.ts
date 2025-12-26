import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IOrdersRepository } from "../../IOrdersRepository";
import { IProductsRepository } from "../../../products/repositories/IProductsRepository";
import { IConversationsRepository } from "../../../conversations/IConversationsRepository";
import prisma from "../../../../shared/infra/prisma";

interface IRequest {
  buyer_id: string;
  seller_id: string;
  product_id: string;
  conversation_id?: string;
  final_price: number;
}

@injectable()
export class CreateOrderUseCase {
  constructor(
    @inject("OrdersRepository")
    private ordersRepository: IOrdersRepository,

    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,

    @inject("ConversationsRepository")
    private conversationsRepository: IConversationsRepository
  ) {}

  async execute({
    buyer_id,
    seller_id,
    product_id,
    conversation_id,
    final_price,
  }: IRequest) {
    // Validar que o vendedor é o dono do produto
    const product = await this.productsRepository.findById(product_id);
    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    if (product.user_id !== seller_id) {
      throw new AppError(
        "Only the product owner can create an order.",
        403
      );
    }

    // Validar que o produto está disponível
    if (product.status !== "AVAILABLE") {
      throw new AppError(
        "Product is not available for sale.",
        400
      );
    }

    // Validar que não é o mesmo usuário
    if (buyer_id === seller_id) {
      throw new AppError(
        "You cannot buy your own product.",
        400
      );
    }

    // Validar conversa se fornecida
    if (conversation_id) {
      const conversation =
        await this.conversationsRepository.findByConversationId(
          conversation_id
        );
      if (!conversation) {
        throw new AppError("Conversation not found.", 404);
      }

      // Validar que a conversa pertence aos usuários corretos
      if (
        conversation.buyer_id !== buyer_id ||
        conversation.seller_id !== seller_id
      ) {
        throw new AppError(
          "Conversation does not match the users.",
          400
        );
      }

      // Validar que a conversa é sobre o produto correto
      if (conversation.product_id !== product_id) {
        throw new AppError(
          "Conversation is not about this product.",
          400
        );
      }
    }

    // Validar preço
    if (final_price <= 0) {
      throw new AppError("Final price must be greater than zero.", 400);
    }

    // Usar transaction para garantir atomicidade
    const order = await prisma.$transaction(async (tx) => {
      // Re-verificar status do produto dentro da transaction
      const productInTx = await tx.product.findUnique({
        where: { id: product_id },
      });

      if (!productInTx) {
        throw new AppError("Product not found.", 404);
      }

      if (productInTx.status !== "AVAILABLE") {
        throw new AppError(
          "Product is not available for sale.",
          400
        );
      }

      // Criar order
      const newOrder = await tx.order.create({
        data: {
          buyer_id,
          seller_id,
          product_id,
          conversation_id,
          final_price,
          status: "PENDING",
        },
      });

      // Atualizar status do produto para RESERVED
      await tx.product.update({
        where: { id: product_id },
        data: { status: "RESERVED" },
      });

      return newOrder;
    });

    return order;
  }
}
