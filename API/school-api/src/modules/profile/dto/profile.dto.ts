import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditProfileDto {
         @IsNotEmpty()
         @IsString()
         @ApiProperty({
           description: 'user Id.',
           example: '4ea3275e-1b41-4b97-a322-ea3a5dc86363',
         })
         user_id: string;

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

         @IsNotEmpty()
         @IsString()
         @ApiProperty({
           description: 'birthday.',
           example: '30/01/1976',
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

         @IsNotEmpty()
         @IsString()
         @ApiProperty({
           description: 'unit.',
           example: '10B',
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

export class EditSubInstallerDto {
         @IsNotEmpty()
         @IsString()
         @ApiProperty({
           description: 'user Id.',
           example: '4ea3275e-1b41-4b97-a322-ea3a5dc86363',
         })
         user_id: string;

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
       }