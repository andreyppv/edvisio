import { IsNotEmpty, IsString,IsArray,ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';



export class CreateAnswerDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Answers)
  answers: Answers[];

  @IsNotEmpty()
  @IsString()
  ins_user_id: string;
}

export class Answers {
    @IsNotEmpty()
    @IsString()
    question_id: string;

    @IsNotEmpty()
    @IsString()
    answer:string;
}

