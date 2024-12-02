import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LocalAuthGuard } from './local.auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { GetCurrentUserId, Public } from '../common/decorators';
import { AtGuard } from '../common/guards';
import { AuthLoginDto } from './dto/auth.dto';
@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AtGuard)
  @Get('reset-pass')
  resetPasseWord(
    @GetCurrentUserId() userId: string,
    // @Body() data: newPasseDto,
  ) {
    try {
      // return this.authService.resetPasseWord(userId, data);
    } catch (error) {
      console.log(error);
    }
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: AuthLoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      if (!loginDto.passWord || !loginDto.userName) {
        throw new BadRequestException('all fields is required');
      }
      const { access_token } = await this.authService.login(loginDto);
      const exp_time = process.env.EXP_TIME;
      const expirationDate = new Date(
        Date.now() + Number(exp_time) * 60 * 1000,
      );
      //   response.cookie('access_token', access_token, {
      //     httpOnly: true,
      //     secure: false,
      //     sameSite: 'lax',
      //     expires: expirationDate,
      //   });
      return { access_token };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException
      ) {
        throw new HttpException(
          { message: error.message, error: 'Forbidden' },
          HttpStatus.FORBIDDEN,
        );
      } else {
        throw new HttpException(
          { message: 'Internal Server Error', error: 'Internal Server Error' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @UseGuards(AtGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  me(@GetCurrentUserId() userId: string): Promise<any> {
    try {
      return this.authService.me(userId);
    } catch (error) {
      console.log(error);
    }
  }
}
