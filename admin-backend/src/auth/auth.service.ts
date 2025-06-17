import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { Types } from 'mongoose';

interface JwtPayload {
  email: string;
  sub: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<(Omit<User, 'password'> & { _id: Types.ObjectId }) | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result as Omit<User, 'password'> & { _id: Types.ObjectId };
    }
    return null;
  }

  async loginWithCredentials(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const user = await this.usersService.findOne(payload.sub);
      if (!user || user.status !== 'active') {
        throw new UnauthorizedException();
      }
      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
