import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class RestartDto {
  @ApiProperty({
    description: 'Indique si le système doit redémarrer',
    example: true,
  })
  @IsBoolean()
  status: boolean;
}
