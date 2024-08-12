import { removeUndefined, throwNotFoundIfFalsy } from 'src/common/utilities/common_utils';
import { createQueryBuilder, EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../entities/users.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
 
    patchOrThrow = async (id: string, entity: any) => {
        throwNotFoundIfFalsy(Number(id));
    
        const sanitisedEntity = removeUndefined(entity);
        const res = await createQueryBuilder()
          .update(UserEntity)
          .set(sanitisedEntity)
          .where('id = :id', { id })
          .returning('*')
          .execute();
        
        // const res = await this.update(
        //     { id: id },
        //     sanitisedEntity,
        //   );
        
        console.log(res);
        if(res.affected<1)
            throwNotFoundIfFalsy(res.affected);
        return res;
      };
}
