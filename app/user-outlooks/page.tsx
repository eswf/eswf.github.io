import { getAllUserForecasts } from '@/lib/forecasts';
import UserOutlooksClient from './user-outlooks-client';
import { Suspense } from 'react';

export default async function UserOutlooksPage() {
  const allForecasts = await getAllUserForecasts();
  const today = new Date().toISOString().slice(0, 10);

  const todaysForecasts = allForecasts.filter((forecast) => forecast.date === today);
  const previousForecasts = allForecasts.filter((forecast) => forecast.date < today);
  const futureForecasts = allForecasts.filter((forecast) => forecast.date > today);

  return (
    <Suspense fallback={<div>Loading outlooks...</div>}>
      <UserOutlooksClient
        todaysForecasts={todaysForecasts}
        previousForecasts={previousForecasts}
        futureForecasts={futureForecasts}
      />
    </Suspense>
  );
}
