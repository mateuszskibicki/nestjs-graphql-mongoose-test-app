import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JWTOutputType {
  @Field()
  accessToken: string;
}
