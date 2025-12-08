import { UserToken } from "@prisma/client";

export interface ICreateUserTokenDTO {
  user_id: string;
  refresh_token: string;
  expires_at: Date;
}

export interface IUsersTokensRepository {
  create({
    user_id,
    refresh_token,
    expires_at,
  }: ICreateUserTokenDTO): Promise<UserToken>;
  findByRefreshToken(refresh_token: string): Promise<UserToken | null>;
  deleteById(id: string): Promise<void>;
}
