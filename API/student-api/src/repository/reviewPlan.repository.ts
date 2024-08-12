import { ReviewPlanEntity } from "src/entities/reviewPlan.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(ReviewPlanEntity)
export class ReviewPlanRepository extends Repository<ReviewPlanEntity>{
    
}