import { useAuth } from '@/hooks';
import { LayoutProps } from '@/models';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { Auth } from '../common';

export function AdminLayout({children}: LayoutProps) {
  const {logout} = useAuth();
  const router = useRouter()

	async function handleLogoutClick() {
		try {
			await logout()
			console.log('redirect to login page')
			router.push('/login')
		} catch (error) {
			console.log('failed to logout', error)
		}
	}
  return (
    <Auth>
        <div>Admin</div>


        {/* <div>{JSON.stringify(profile)}</div> */}

        <div>{children}</div>
        <Link href="/about">Logout</Link>
    </Auth>
  );
}
