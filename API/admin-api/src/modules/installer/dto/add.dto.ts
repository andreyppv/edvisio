import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditProfileDto {
         @IsNotEmpty()
         @IsString()
         @ApiProperty({
           description: 'first Name.',
           example: 'Test',
         })
         firstName: string;

         @IsOptional()
         @IsString()
         @ApiProperty({
           description: 'middle Name.',
           example: 'Test',
         })
         middleName: string;

         @IsNotEmpty()
         @IsString()
         @ApiProperty({
           description: 'last Name.',
           example: 'Test',
         })
         lastName: string;

         // @IsNotEmpty()
         // @IsString()
         // @ApiProperty({
         //     description: 'birthday.',
         //     example: '30/01/1976',
         // })
         // birthday: string;

         @IsNotEmpty()
         @IsString()
         @ApiProperty({
           description: 'email.',
           example: 'test@gmail.com',
         })
         email: string;

         @IsNotEmpty()
         @IsString()
         @ApiProperty({
           description: 'phone.',
           example: '+ 1(999) 999-9999',
         })
         phone: string;

         @IsNotEmpty()
         @IsString()
         @ApiProperty({
           description: 'street Address.',
           example: 'Fairway St',
         })
         streetAddress: string;

         @IsString()
         @ApiProperty({
           description: 'unit.',
           example: '7001',
         })
         unit: string;

         @IsNotEmpty()
         @IsString()
         @ApiProperty({
           description: 'city.',
           example: 'Quinton',
         })
         city: string;

         @IsNotEmpty()
         @IsString()
         @ApiProperty({
           description: 'state.',
           example: 'VA',
         })
         state: string;

         @IsNotEmpty()
         @IsNumber()
         @ApiProperty({
           description: 'zipCode.',
           example: '123456',
         })
         zipCode: number;

         @IsNotEmpty()
         @IsNumber()
         @ApiProperty({
           description: 'offermodel.',
           example: '1',
         })
         offermodel: number;
       }