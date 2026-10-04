import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { AppShell } from '../../components/layout/app-shell';

export const dynamic = 'force-dynamic';

export default async function PrivateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) redirect('/sign-in');
  await auth.protect();
  return <AppShell>{children}</AppShell>;
}
