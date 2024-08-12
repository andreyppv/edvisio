import { Injectable,InternalServerErrorException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { SettingsRepository } from 'src/repository/settings.repository';
import { In } from 'typeorm';
import { UpdateMilestoneFundPerDto } from './dto/milestone-fund.dto';

@Injectable()
export class MilestoneFundService {
    constructor( 
        @InjectRepository(SettingsRepository) private readonly settingsRepository: SettingsRepository
    ) {}

    async getMilestonePer(){
        try {
            let milestoneFundPer = await this.settingsRepository.find({select:['value'], where:{key:In(['milestone1fundper', 'milestone2fundper', 'milestone3fundper'])}})
                  
            return {"statusCode": 200, data: milestoneFundPer} 
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
    
    async updateMilestonePer(updateMilestoneFundPerDto: UpdateMilestoneFundPerDto){
        try{
            await this.settingsRepository.update({key: 'milestone1fundper'},{value: updateMilestoneFundPerDto.milestone1fundper})
            await this.settingsRepository.update({key: 'milestone2fundper'},{value: updateMilestoneFundPerDto.milestone2fundper})
            await this.settingsRepository.update({key: 'milestone3fundper'},{value: updateMilestoneFundPerDto.milestone3fundper})
            return {"statusCode": 200, "message": ['Milestone fund % updated successfully'] };            
        }catch(error){
            return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
        }
    }
}
