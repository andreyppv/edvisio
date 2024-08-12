import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/users.repository';
import { getManager, In } from 'typeorm';

@Injectable()
export class InstallerService {

    constructor( 
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    ) {}

    async checkInstaller(id) {
        try {
          const entityManager = getManager();
      const roles = await entityManager.query(`select distinct t2.role_id as role_id from tblportal t join tblrolesmaster t2 on t2.portal_id = t.id where t."name" = 'installer' and t2.delete_flag = 'N'`);
      if(roles.length>0){
        let r = []
        for (let i = 0; i < roles.length; i++) {
          r.push(roles[i]['role_id']);
        }
        let offermodel = await entityManager.query(`select offermodel from tblinstaller where user_id = '${id}'`)
          let installer = await this.userRepository.findOne({ where:{id:id, role:In(r), delete_flag:'N'} });
          return {"statusCode": 200, installer: installer,offermodel:offermodel} 
      }else{
        return {"statusCode": 400, "message": ["Invalid Installer ID"],"error": "Bad Request"}
      }
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
        
    }  
}
