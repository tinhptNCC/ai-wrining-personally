import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { ENV } from 'src/config';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDTO) {
    const { username, password, email } = dto;

    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository.save(
      this.userRepository.create({
        username,
        password: hashedPassword,
        email,
      }),
    );

    return { success: true };
  }

  async login(dto: LoginDTO, res: Response) {
    const { username, password } = dto;

    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: ENV.JWT.SECRET,
      expiresIn: Number(ENV.JWT.EXPIRES),
    });

    res.cookie(ENV.COOKIE.ACCESS_TOKEN_NAME || '', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: parseInt(process.env.JWT_EXPIRATION_TIME || '3600') * 1000,
    });

    return {
      accessToken,
      cookieName: ENV.JWT.COOKIE_NAME,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}
