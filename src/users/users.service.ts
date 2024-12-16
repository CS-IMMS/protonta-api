import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prismaModule/prisma-service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userName: true,
        phoneNumber: true,
        role: true,
        allSerre: {
          select: {
            id: true,
            name: true,
            allCulture: {
              select: {
                id: true,
                name: true,
                variety: true,
                type: true,
                description: true,
                createdAt: true,
                startProduction: true,
                endProduction: true,
                productionIsEnded: true,
                updatedAt: true,
                initialConfig: {
                  select: {
                    id: true,
                    createdAt: true,
                    HumMin: true,
                    HumMax: true,
                    TemMin: true,
                    TemMax: true,
                    LumMin: true,
                    LumMax: true,
                    PressMin: true,
                    PressMax: true,
                    Co2Min: true,
                    Co2Max: true,
                    PolStartTime: true,
                    PolEndTime: true,
                    Periode: true,
                    MomentFloraison: true,
                    initialCapteurs: {
                      select: {
                        id: true,
                        S1: true,
                        descriptionS1: true,
                        S2: true,
                        descriptionS2: true,
                        S3: true,
                        descriptionS3: true,
                        S4: true,
                        descriptionS4: true,
                        S5: true,
                        descriptionS5: true,
                        S6: true,
                        descriptionS6: true,
                        S7: true,
                        descriptionS7: true,
                        S8: true,
                        descriptionS8: true,
                        S9: true,
                        descriptionS9: true,
                        S10: true,
                        descriptionS10: true,
                        S11: true,
                        descriptionS11: true,
                        S12: true,
                        descriptionS12: true,
                        S13: true,
                        descriptionS13: true,
                        S14: true,
                        descriptionS14: true,
                        S15: true,
                        descriptionS15: true,
                        S16: true,
                        descriptionS16: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async create(createUserDto: CreateUserDto) {
    const { firstName, lastName, passWord, role, phone } = createUserDto;
    try {
      const hashedPassword = await bcrypt.hash(passWord, 10);
      const userName = this.generateUsername(firstName, lastName);
      const created = await this.prisma.users.create({
        data: {
          password: hashedPassword,
          firstName: firstName ?? null,
          lastName: lastName ?? null,
          phoneNumber: phone ?? null,
          role: role,
          userName: userName,
        },
      });
      return created;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }
  generateUsername(firstName: string, lastName: string): string {
    const firstPart = firstName.slice(0, 2).toLowerCase();

    const lastPart = lastName.slice(-2).toLowerCase();

    const randomNumbers = Math.floor(100 + Math.random() * 90);
    const username = firstPart + lastPart + randomNumbers;

    return username;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Vérifier si l'utilisateur existe
    const userData = await this.getIfUserExist(id);

    const { firstName, lastName, passWord, role, userName, phoneNumber } =
      updateUserDto;
    console.log(phoneNumber);

    // Préparer les données de mise à jour
    const updateData: any = {
      firstName: firstName ?? userData.firstName,
      lastName: lastName ?? userData.lastName,
      phoneNumber: phoneNumber ?? userData.phoneNumber,
      role: role ?? userData.role,
      userName: userName ?? userData.userName,
    };

    if (passWord) {
      updateData.password = await bcrypt.hash(passWord, 10);
    }

    try {
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          userName: true,
          phoneNumber: true,
          role: true,
        },
      });
      return updatedUser;
    } catch (error) {
      console.log(error);

      // Amélioration de la gestion d'erreur
      throw new InternalServerErrorException(
        `Erreur lors de la mise à jour de l'utilisateur: ${error.message}`,
      );
    }
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
  async remove(id: string) {
    try {
      const deletedUser = await this.prisma.users.delete({
        where: { id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          userName: true,
          phoneNumber: true,
          role: true,
        },
      });
      return { message: 'User successfully deleted', deletedUser };
    } catch (error) {
      throw new InternalServerErrorException(
        `Erreur lors de la suppression de l'utilisateur: ${error.message}`,
      );
    }
  }

  async addUserToGreenhouse(userId: string, greenhouseId: string) {
    return this.prisma.serre.update({
      where: { id: greenhouseId },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          select: {
            firstName: true,
            lastName: true,
            userName: true,
            phoneNumber: true,
          },
        },
      },
    });
  }
}
