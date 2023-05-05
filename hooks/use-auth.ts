import { LocalStorage } from '@/models';
import { useEffect, useState } from 'react';

// Auth --> Protected Pages
// <Auth>{children}</Auth>

export function useAuth() {
	const [pointFirst, setPoint] = useState<number>(0)
	const [name, setName] = useState<string>("")

	useEffect(()=>{
		const nameWallet = LocalStorage.accessNameWallet
		if(nameWallet) setName(nameWallet)
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
		name,
	}
}