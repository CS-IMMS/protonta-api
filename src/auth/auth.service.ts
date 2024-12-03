import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import redisClient from 'src/utils/redisConnection';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, Tokens } from './types';

import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prismaModule/prisma-service';
import { AuthForgotPassWordDto, AuthLoginDto } from './dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  generateVerificationCode(): { code: string; deadline: Date } {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const deadline = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return { code, deadline };
  }
  async login(dto: AuthLoginDto): Promise<any> {
    const { passWord, userName } = dto;
    const user = await this.prisma.users.findUnique({
      where: {
        userName: userName,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const isPasswordValid = await bcrypt.compare(passWord, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is not match');
    }
    const { access_token } = await this.getTokens(
      user.id,
      user.userName,
      user.role,
    );
    return { access_token };
  }
  async getIfUserExist(id: string) {
    const getUser = await this.prisma.users.findUnique({
      where: {
        id: id,
      },
    });
    if (!getUser) {
      throw new NotFoundException('User not found');
    }
    return getUser;
  }
  generatePassword(length: number): number {
    let password = 0;

    for (let i = 0; i < length; i++) {
      const digit = Math.floor(Math.random() * 10);
      password = password * 10 + digit;
    }
    while (password < Math.pow(10, length - 1)) {
      const digit = Math.floor(Math.random() * 10);
      password = password * 10 + digit;
    }
    return password;
  }
  //   async verifieCodeToForgetPasse(data: { code: string }) {
  //     const { code } = data;
  //     const verifieIfCodeExist = await this.prisma.verifieEmailCode.findFirst({
  //       where: {
  //         code: Number(code),
  //       },
  //     });
  //     if (!verifieIfCodeExist) {
  //       throw new ForbiddenException('Code incorrect ou invalid');
  //     }
  //     return { message: 'le code est valide' };
  //   }
  // async changePassWord(code: string, data: AuthChangePasswordDto) {
  //   const { newPasse, confirmPasse } = data;
  //   const verifieIfCodeExist = await this.prisma.verifieEmailCode.findFirst({
  //     where: {
  //       code: Number(code),
  //     },
  //     select: {
  //       user: {
  //         select: {
  //           id: true,
  //           firstName: true,
  //           lastName: true,
  //           email: true,
  //         },
  //       },
  //     },
  //   });
  //   if (!verifieIfCodeExist) {
  //     throw new ForbiddenException('Code incorrect ou invalid');
  //   }
  //   if (newPasse !== confirmPasse) {
  //     throw new ForbiddenException('Les mots de passe ne sont pas identiques');
  //   }
  //   await this.prisma.user.update({
  //     where: {
  //       id: verifieIfCodeExist.user.id,
  //     },
  //     data: {
  //       password: await bycript.hash(newPasse, 12),
  //     },
  //   });
  //   await this.prisma.verifieEmailCode.delete({
  //     where: {
  //       code: Number(code),
  //     },
  //   });
  //   return { message: 'Mot de passe est modifier' };
  // }

  async me(user: string) {
    await this.getIfUserExist(user);
    const userData = await this.prisma.users.findUnique({
      where: {
        id: user,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        userName: true,
        allSerre: {
          include: {
            users: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                role: true,
              },
            },
            allCulture: {
              include: {
                initialConfig: {
                  select: {
                    Co2Max: true,
                    _count: true,
                    Co2Min: true,
                    createdAt: true,
                    CultureInfos: true,
                    HumMax: true,
                    HumMin: true,
                    id: true,
                    initialCapteurs: true,
                    LumMax: true,
                    LumMin: true,
                    MomentFloraison: true,
                    Periode: true,
                    PolEndTime: true,
                    PolStartTime: true,
                    PressMax: true,
                    PressMin: true,
                    TemMax: true,
                    TemMin: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return userData;
  }

  async getTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
      role: role,
    };
    const exp_time_minutes_at = process.env.EXP_TIME_AT;
    const [at] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: `${exp_time_minutes_at}d`,
      }),
    ]);

    return {
      access_token: at,
    };
  }
  async generateRandomToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      randomBytes(32, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          const token = buffer.toString('hex');
          resolve(token);
        }
      });
    });
  }
  async forgotPass(dto: AuthForgotPassWordDto) {}
  async resetPasseWord(userId: string, data: any) {
    return 'reset pass';
  }
}
