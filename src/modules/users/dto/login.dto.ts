import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}
