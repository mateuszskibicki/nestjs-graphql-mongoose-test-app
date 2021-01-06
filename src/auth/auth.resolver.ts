import { JWTOutputType } from './models';
import { AuthService } from './auth.service';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UserType, User } from './models';
import { AuthCredentialsDto } from './dto';

const returnUserType = () => UserType;
const jwtOutputType = () => JWTOutputType;

@Resolver(returnUserType)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  /**
   * Sign-up a User
   */
  @Mutation(returnUserType)
  signUp(
    @Args('authCredentialsDto') authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    return this.authService.signUp(authCredentialsDto);
  }

  /**
   * Sign-in a User
   */
  @Mutation(jwtOutputType)
  signIn(
    @Args('authCredentialsDto') authCredentialsDto: AuthCredentialsDto,
  ): Promise<JWTOutputType> {
    return this.authService.signIn(authCredentialsDto);
  }
}
