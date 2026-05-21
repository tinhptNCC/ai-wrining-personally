import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import type { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }
}
