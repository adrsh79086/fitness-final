import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const { name, email, password } = registerDto;

      const existingUser =
        await this.usersService.findByEmail(email);

      if (existingUser) {
        throw new ConflictException(
          'Email already registered',
        );
      }

      const saltRounds =
        Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

      const passwordHash = await bcrypt.hash(
        password,
        saltRounds,
      );

      const user = await this.usersService.create({
        name,
        email,
        passwordHash,
      });

      const payload = {
        sub: user.userId,
        email: user.email,
      };

    
      const accessToken =
        this.jwtService.sign(payload);

      return {
        message: 'Registration successful',
        accessToken,
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
  console.error('REGISTER ERROR:', error);

  if (error instanceof ConflictException) {
    throw error;
  }

  throw new InternalServerErrorException(
    'Failed to register user',
  );
}
  }
  async login(loginDto: LoginDto) {
  try {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const payload = {
      sub: user.userId,
      email: user.email,
      role:user.role,
    };

    const accessToken =
      this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      accessToken,
      user: {
        userId: user.userId,
        name: user.name,
        role : user.role,
      },
    };
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }

    throw new InternalServerErrorException(
      'Failed to login',
    );
  }
}
}