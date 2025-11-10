import { differenceInHours } from 'date-fns';
import { TCatStatus } from '../interfaces/cats.interfaces';

export const calculateStatus = (lastFeedingTime: Date | string): TCatStatus => {
  if (!lastFeedingTime) return 'ok';

  const now = new Date();
  const feedingDate = new Date(lastFeedingTime);

  const diffHours = differenceInHours(now, feedingDate);

  if (diffHours > 8 && diffHours < 16) return 'alert';
  if (diffHours > 16) return 'danger';

  return 'ok';
};

export const getWorseStatus = (
  eatStatus: TCatStatus,
  drinkStatus: TCatStatus,
): TCatStatus => {
  const severityOrder = {
    ok: 0,
    alert: 1,
    danger: 2,
  };

  return severityOrder[eatStatus] >= severityOrder[drinkStatus]
    ? eatStatus
    : drinkStatus;
};
