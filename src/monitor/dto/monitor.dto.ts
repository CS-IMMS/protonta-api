import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddSerreDto {
  @ApiProperty({
    description: 'Identifiant unique de la protenta',
    example: 'p10002',
  })
  @IsNotEmpty()
  serreId: string;
  @ApiProperty({
    description: 'Identifiant unique du capteur',
    example: 'c1001',
  })
  @IsNotEmpty()
  capteurId: string;

  @ApiProperty({
    description: 'Identifiant unique du protenta associé à la serre',
    example: 'p001',
  })
  @IsNotEmpty()
  protentaId: string;
}

export class AddCultureDto {
  @ApiProperty({
    description: 'Nom de la culture',
    example: 'Tomates',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Variété de la culture',
    example: 'T-400',
  })
  variety?: string;

  @ApiProperty({
    description: 'Type de culture',
    example: 'Légume',
  })
  type?: string;

  @ApiProperty({
    description: 'Description de la culture',
    example: 'Tomates cerises cultivées sous serre',
  })
  description?: string;

  @ApiProperty({
    description: 'Date de début de production',
    example: '2024-03-15',
  })
  @IsNotEmpty()
  startProduction: string;

  @ApiProperty({
    description: 'Estimation du temps que va prendre la culture',
    example: '90 jour',
  })
  @IsNotEmpty()
  @IsNumber()
  estimationDate: number;
}
