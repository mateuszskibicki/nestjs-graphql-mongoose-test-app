import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument, JWTOutputType } from './models';
import { AuthCredentialsDto } from './dto';
import { JWTPayload } from './interfaces';
import { ObjectId } from 'mongodb';

const hashPassword = async (password: string, salt: string): Promise<string> =>
  await bcrypt.hash(password, salt);

const validatePassword = async (
  user: User,
  password: string,
): Promise<boolean> =>
  (await bcrypt.hash(password, user.salt)) === user.password;

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();

      // Create new user
      const user = await new this.userModel({
        ...authCredentialsDto,
        password: await hashPassword(authCredentialsDto.password, salt),
        salt,
      }).save();

      this.logger.verbose(`User created. Username: ${user.username}.`);
      return user;
    } catch (err) {
      this.logger.error(`User signed in error. Error object: ${err}.`);
      // Catch unique mongodb error or throw
      throw err.code === 11000
        ? new ConflictException('User already exists.')
        : err;
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<JWTOutputType> {
    const { username, password } = authCredentialsDto;

    // Check if user exists
    const user = await this.userModel.findOne({ username });
    if (!user) throw new NotFoundException();

    // Validate password
    if (!(await validatePassword(user, password)))
      throw new UnauthorizedException();

    // JWT Part
    const payload: JWTPayload = { username: user.username };

    this.logger.verbose(`User signed in. Username: ${user.username}.`);

    return { accessToken: await this.jwtService.sign(payload) };
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: new ObjectId(id) });
    if (!user) throw new NotFoundException();
    return user;
  }
}
