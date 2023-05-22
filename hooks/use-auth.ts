import { LocalStorage } from '@/models';
import { useEffect, useState } from 'react';

// Auth --> Protected Pages
// <Auth>{children}</Auth>

export function useAuth() {
	const [nameWallet, setName] = useState<string>("")

	useEffect(()=>{
		const name = LocalStorage.accessNameWallet
		if(name) setName(name)
	},[])

	function login(name: string) {
		LocalStorage.setNameWallet(name)
	}

	function logout() {
		LocalStorage.removeNameWallet();
		setName("");
	}

	return {
		login,
		logout,
		nameWallet,
	}
}