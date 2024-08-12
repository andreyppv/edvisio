import { createParamDecorator, ExecutionContext, NotFoundException } from '@nestjs/common';
import { NotFound } from 'http-errors';
 
export enum TuitionProductIDs {
  TUITION_FLEXPLUS = 1,
  TUITION_EASE = 2,
  TUITION_FLEX = 3,
  TUITION_EXTENDS = 4,
}

export const throwNotFoundIfFalsy = ((value?: any): void => {
  if (!value) {
    throw new NotFound();
  }
});

export const removeUndefined = (obj: object) =>
  Object.entries(obj).reduce((acc: object, curr: any[]) => {
    if (curr[1]) {
      return { ...acc, [curr[0]]: curr[1] };
    }
    return acc;
  }, {});
