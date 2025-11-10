import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CatsService } from '../cats.service';
import {
  calculateStatus,
  getWorseStatus,
} from 'src/common/helpers/cats-tasks.helper';
import { TCatStatus } from 'src/common/interfaces/cats.interfaces';

@Injectable()
export class CatsTasks {
  private readonly logger = new Logger(CatsTasks.name);
  constructor(private readonly catsService: CatsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCatsStatusCheck() {
    this.logger.log('starting cats status validation');
    const cats = await this.catsService.findAllWithoutCompany();
    for (const cat of cats) {
      if (cat.lastActivitiesUpdate !== null) {
        const eat = cat.lastActivitiesUpdate?.eat;
        const drink = cat.lastActivitiesUpdate?.drink;

        let eatStatus: TCatStatus;
        let drinkStatus: TCatStatus;

        if (eat) {
          eatStatus = calculateStatus(eat);
        }
        if (drink) {
          drinkStatus = calculateStatus(drink);
        }

        const worseStatus = getWorseStatus(eatStatus, drinkStatus);

        if (cat.status != worseStatus) {
          await this.catsService.updateByCat({ ...cat, status: worseStatus });
          this.logger.log(`${cat.name} updated successfully`);
        }
      }
    }
  }
}
