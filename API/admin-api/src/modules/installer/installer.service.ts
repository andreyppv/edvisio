import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EditProfileDto } from './dto/add.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../mail/mail.service';
import { config } from 'dotenv';
import { UserEntity, Flags } from '../../entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../repository/users.repository';
import { InstallerRepository } from '../../repository/installer.repository';
import { Installer } from '../../entities/installer.entity';
import { getManager } from 'typeorm';
config();
@Injectable()
export class InstallerService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(InstallerRepository)
    private readonly installerRepository: InstallerRepository,
    private readonly mailService: MailService,
  ) {}

  async add(editProfileDto: EditProfileDto) {
    try {
      let url: any = process.env.InstallerUrl;
      url = url + 'login';

      const user = new UserEntity();
      user.email = editProfileDto.email;
      user.firstName = editProfileDto.firstName;
      user.middleName = editProfileDto.middleName;
      user.lastName = editProfileDto.lastName;

      const entityManager = getManager();
      let installer_role_id = await entityManager.query(
        `select id from tblroles where "name" = 'installer' order by id asc limit 1`,
      );
      user.role = installer_role_id[0].id;

      var length = 8,
        charset =
          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        password = '';
      for (var i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }

      user.salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, user.salt);
      user.active_flag = Flags.Y;

      let users: any = await this.userRepository.find({
        select: ['email'],
        where: { delete_flag: 'N', email: user.email, role: user.role },
      });
      if (users.length > 0) {
        return {
          statusCode: 400,
          message: ['This Email Already Exists'],
          error: 'Bad Request',
        };
      }

      let userid: any = await this.userRepository.save(user);
      userid = userid.id;
      let installer = new Installer();

      (installer.user_id = userid),
        (installer.firstName = editProfileDto.firstName);
          installer.middleName = editProfileDto.middleName;
      installer.lastName = editProfileDto.lastName;
      // installer.birthday = editProfileDto.birthday
      installer.email = editProfileDto.email;
      installer.phone = editProfileDto.phone;
      installer.streetAddress = editProfileDto.streetAddress;
      installer.unit = editProfileDto.unit;
      installer.city = editProfileDto.city;
      installer.state = editProfileDto.state;
      installer.zipCode = editProfileDto.zipCode;
      installer.offermodel = editProfileDto.offermodel;

      await this.installerRepository.save(installer);
      this.mailService.add(user.email, password, url);
      return { statusCode: 200 };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async get() {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(
        `select t2.id as user_id, t2.active_flag as active_flag, t.* from tblinstaller t join tbluser t2 on t2.id=t.user_id where t2.delete_flag = 'N'  order by t."createdAt" desc `,
      );
      //console.log(rawData)
      return { statusCode: 200, data: rawData };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}
