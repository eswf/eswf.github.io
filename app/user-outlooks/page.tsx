import { getAllUserForecasts } from '@/lib/forecasts';
import UserOutlooksClient from './user-outlooks-client';

export default async function UserOutlooksPage() {
  const allForecasts = await getAllUserForecasts();
  const today = new Date().toISOString().slice(0, 10);

  const todaysForecasts = allForecasts.filter((forecast) => forecast.date === today);
  const previousForecasts = allForecasts.filter((forecast) => forecast.date < today);
  const futureForecasts = allForecasts.filter((forecast) => forecast.date > today);

  return (
    <UserOutlooksClient 
      todaysForecasts={todaysForecasts}
      previousForecasts={previousForecasts}
      futureForecasts={futureForecasts}
    />
  );
}