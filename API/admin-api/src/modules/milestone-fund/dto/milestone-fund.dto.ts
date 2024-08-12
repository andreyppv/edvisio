import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateMilestoneFundPerDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Milestone 1 fund %.',
        example: '20',
    })
    milestone1fundper: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Milestone 2 fund %.',
        example: '20',
    })
    milestone2fundper: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Milestone 3 fund %.',
        example: '60',
    })
    milestone3fundper: string;

}