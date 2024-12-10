import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RestartDto {
  @ApiProperty({
    description: 'Indique si le système doit redémarrer',
    example: true,
  })
  @IsBoolean()
  status: boolean;
}

enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

enum StatusS12 {
  DEPLOY = 'Deploy',
  REACTOR = 'Reactor',
  ARRETER = 'Arreter',
}

export class MonitorCommandeDto {
  @ApiPropertyOptional({
    description: "État du capteur S1, peut être 'active' ou 'inactive'",
  })
  @IsOptional()
  @IsEnum(Status)
  S1?: Status;

  @ApiPropertyOptional({
    description: "État du capteur S2, peut être 'active' ou 'inactive'",
  })
  @IsOptional()
  @IsEnum(Status)
  S2?: Status;

  @ApiPropertyOptional({
    description: "État du capteur S3, peut être 'active' ou 'inactive'",
  })
  @IsOptional()
  @IsEnum(Status)
  S3?: Status;

  @ApiPropertyOptional({
    description: "État du capteur S4, peut être 'active' ou 'inactive'",
  })
  @IsOptional()
  @IsEnum(Status)
  S4?: Status;

  @ApiPropertyOptional({
    description: "État du capteur S5, peut être 'active' ou 'inactive'",
  })
  @IsOptional()
  @IsEnum(Status)
  S5?: Status;

  @ApiPropertyOptional({
    description: "État du capteur S6, peut être 'active' ou 'inactive'",
  })
  @IsOptional()
  @IsEnum(Status)
  S6?: Status;

  @ApiPropertyOptional({
    description: "État du capteur S7, peut être 'active' ou 'inactive'",
  })
  @IsOptional()
  @IsEnum(Status)
  S7?: Status;

  @ApiPropertyOptional({
    description: "État du capteur S8, peut être 'active' ou 'inactive'",
  })
  @IsOptional()
  @IsEnum(Status)
  S8?: Status;

  @ApiPropertyOptional({
    description: "État du capteur S9, peut être 'active' ou 'inactive'",
  })
  @IsOptional()
  @IsEnum(Status)
  S9?: Status;

  @ApiPropertyOptional({
    description: "État du capteur S10, peut être 'active' ou 'inactive'",
  })
  @IsOptional()
  @IsEnum(Status)
  S10?: Status;

  @ApiPropertyOptional({
    description: "État du capteur S11, peut être 'active' ou 'inactive'",
  })
  @IsOptional()
  @IsEnum(Status)
  S11?: Status;

  @ApiPropertyOptional({
    description:
      "État du capteur S12, avec des valeurs spécifiques 'Deploy', 'Reactor', 'Arreter'",
  })
  @IsOptional()
  @IsEnum(StatusS12)
  S12?: StatusS12;

  @ApiPropertyOptional({
    description: "État du capteur S13, peut être 'active' ou 'inactive'",
  })
  @IsOptional()
  @IsEnum(Status)
  S13?: Status;

  @ApiPropertyOptional({
    description: "État du capteur S14, peut être 'active' ou 'inactive'",
  })
  @IsOptional()
  @IsEnum(Status)
  S14?: Status;

  @ApiPropertyOptional({
    description: "État du capteur S15, peut être 'active' ou 'inactive'",
  })
  @IsOptional()
  @IsEnum(Status)
  S15?: Status;

  @ApiPropertyOptional({
    description: "État du capteur S16, peut être 'active' ou 'inactive'",
  })
  @IsOptional()
  @IsEnum(Status)
  S16?: Status;

  @ApiPropertyOptional({ description: "Minimum d'humidité en pourcentage" })
  @IsOptional()
  @IsNumber()
  HumMin?: number;

  @ApiPropertyOptional({ description: "Maximum d'humidité en pourcentage" })
  @IsOptional()
  @IsNumber()
  HumMax?: number;

  @ApiPropertyOptional({
    description: 'Température minimale en degrés Celsius',
  })
  @IsOptional()
  @IsNumber()
  TemMin?: number;

  @ApiPropertyOptional({
    description: 'Température maximale en degrés Celsius',
  })
  @IsOptional()
  @IsNumber()
  TemMax?: number;

  @ApiPropertyOptional({ description: 'Luminosité minimale en lux' })
  @IsOptional()
  @IsNumber()
  LumMin?: number;

  @ApiPropertyOptional({ description: 'Luminosité maximale en lux' })
  @IsOptional()
  @IsNumber()
  LumMax?: number;

  @ApiPropertyOptional({ description: 'Pression minimale en hPa' })
  @IsOptional()
  @IsNumber()
  PressMin?: number;

  @ApiPropertyOptional({ description: 'Pression maximale en hPa' })
  @IsOptional()
  @IsNumber()
  PressMax?: number;

  @ApiPropertyOptional({ description: 'CO2 minimum en ppm' })
  @IsOptional()
  @IsNumber()
  Co2Min?: number;

  @ApiPropertyOptional({ description: 'CO2 maximum en ppm' })
  @IsOptional()
  @IsNumber()
  Co2Max?: number;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S1',
  })
  @IsOptional()
  @IsBoolean()
  param300?: boolean;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S2',
  })
  @IsOptional()
  @IsBoolean()
  param301?: boolean;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S3',
  })
  @IsOptional()
  @IsBoolean()
  param302?: boolean;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S4',
  })
  @IsOptional()
  @IsBoolean()
  param303?: boolean;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S5',
  })
  @IsOptional()
  @IsBoolean()
  param304?: boolean;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S6',
  })
  @IsOptional()
  @IsBoolean()
  param305?: boolean;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S7',
  })
  @IsOptional()
  @IsBoolean()
  param306?: boolean;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S8',
  })
  @IsOptional()
  @IsBoolean()
  param307?: boolean;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S9',
  })
  @IsOptional()
  @IsBoolean()
  param308?: boolean;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S10',
  })
  @IsOptional()
  @IsBoolean()
  param309?: boolean;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S11',
  })
  @IsOptional()
  @IsBoolean()
  param310?: boolean;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S12',
  })
  @IsOptional()
  @IsBoolean()
  param311?: boolean;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S13',
  })
  @IsOptional()
  @IsBoolean()
  param313?: boolean;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S14',
  })
  @IsOptional()
  @IsBoolean()
  param314?: boolean;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S15',
  })
  @IsOptional()
  @IsBoolean()
  param315?: boolean;

  @ApiPropertyOptional({
    description: 'Paramètre booléen - Désactiver manuelAuto S16',
  })
  @IsOptional()
  @IsBoolean()
  param316?: boolean;
  @ApiPropertyOptional({
    description: 'Heure de début de la pollinisation (format string)',
  })
  @IsOptional()
  @IsString()
  PolStartTime?: string;

  @ApiPropertyOptional({
    description: 'Heure de fin de la pollinisation (format string)',
  })
  @IsOptional()
  @IsString()
  PolEndTime?: string;

  @ApiPropertyOptional({ description: 'Période de floraison (format string)' })
  @IsOptional()
  @IsString()
  Periode?: string;

  @ApiPropertyOptional({
    description: 'Moment de la floraison, doit être 0 ou 1',
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1], { message: 'MomentFloraison doit être 0 ou 1.' })
  MomentFloraison?: number;
}
export interface NotificationDto {
  id: string;
  timestamp: Date;
  type: NotificationType;
  value: string;
}
