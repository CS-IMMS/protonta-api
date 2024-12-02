import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AtGuard } from 'src/common/guards';
import { Role } from 'src/roles/role.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AtGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  @Role([UserRole.ADMIN, UserRole.SUDO])
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Role([UserRole.ADMIN, UserRole.SUDO])
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = this.usersService.getIfUserExist(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Role([UserRole.ADMIN, UserRole.SUDO])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = this.usersService.getIfUserExist(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.usersService.remove(id);
  }

  @ApiOperation({ summary: 'Ajouter un utilisateur à une serre' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur ajouté à la serre avec succès',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Role([UserRole.ADMIN, UserRole.SUDO])
  @Post(':userId/greenhouses/:greenhouseId')
  async addUserToGreenhouse(
    @Param('userId') userId: string,
    @Param('greenhouseId') greenhouseId: string,
  ) {
    const user = await this.usersService.getIfUserExist(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.usersService.addUserToGreenhouse(userId, greenhouseId);
  }
}
