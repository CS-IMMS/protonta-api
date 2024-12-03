import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { GetCurrentUserId } from 'src/common/decorators';
import { Role } from 'src/roles/role.decorator';
import { AddCultureDto, AddSerreDto } from './dto/monitor.dto';
import { MonitorService } from './monitor.service';

@ApiTags('Monitor')
// @ApiBearerAuth()
// @UseGuards(AtGuard, RolesGuard)
@Controller('monitor')
export class MonitorController {
  constructor(private monitorService: MonitorService) {}
  @ApiOperation({
    summary: 'Récupère les données agrégées pour une période donnée',
    description:
      'Ce end-point permet de récupérer des données de capteurs agrégées pour une période spécifiée : minute, heure ou jour.',
  })
  @ApiQuery({
    name: 'period',
    required: true,
    description:
      'La période pour laquelle récupérer les données agrégées (minute, hour, day)',
    enum: ['minute', 'hour', 'day'],
  })
  @Get()
  async getAggregatedData(@Query('period') period: string) {
    if (!['minute', 'hour', 'day'].includes(period)) {
      throw new BadRequestException(
        'Invalid period. Must be one of: minute, hour, day',
      );
    }

    return this.monitorService.getDataForPeriod(period);
  }
  @Get('range')
  @ApiOperation({
    summary: 'Récupère les données agrégées pour une plage de dates',
    description:
      'Ce end-point permet de récupérer des données agrégées de capteurs entre deux dates spécifiées.',
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'La date de début de la période (format: YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'La date de fin de la période (format: YYYY-MM-DD)',
  })
  async getAggregatedDataForDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Use YYYY-MM-DD for both startDate and endDate.',
      );
    }

    return this.monitorService.getDataForDateRange(start, end);
  }
  @ApiOperation({
    summary: 'Ajouter une nouvelle serre',
    description:
      "Permet à un administrateur d'associer une serre à un protenta. Cette opération nécessite des droits administrateur SUDO.",
  })
  @ApiResponse({
    status: 201,
    description: 'La serre a été ajoutée avec succès',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Nécessite des droits administrateur',
  })
  // @Role([UserRole.SUDO])
  @Post('add-serre')
  async addSerre(
    @GetCurrentUserId() userId: string,
    @Body() addSerreDto: AddSerreDto,
  ) {
    return this.monitorService.addSerre(userId, addSerreDto);
  }
  @ApiOperation({
    summary: 'Ajouter une nouvelle culture',
    description:
      "Permet à un administrateur d'ajouter une nouvelle culture à une serre. Cette opération nécessite des droits administrateur SUDO.",
  })
  @ApiResponse({
    status: 201,
    description: 'La culture a été ajoutée avec succès',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit - Nécessite des droits administrateur',
  })
  // @Role([UserRole.ADMIN, UserRole.SUDO])
  @Post('add-culture/:serreId')
  async addCulture(
    @Param('serreId') serreId: string,
    @GetCurrentUserId() userId: string,
    @Body() addCultureDto: AddCultureDto,
  ) {
    return this.monitorService.addCulture(userId, addCultureDto, serreId);
  }
  @ApiOperation({
    summary: 'Récupérer toutes les serres',
    description:
      'Permet de récupérer la liste de toutes les serres disponibles.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des serres récupérée avec succès',
  })
  // @Role([UserRole.ADMIN, UserRole.SUDO])
  @Get('serres')
  async getAllSerres() {
    return this.monitorService.getAllSerres();
  }
}
