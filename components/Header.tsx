// components/Header.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
    title: string;
    subtitle: string;
    onButtonClick?: () => void;
    showProfile?: boolean;
}

export default function Header({ title, subtitle, onButtonClick, showProfile = false }: HeaderProps) {
    const router = useRouter();
    const { user, signOut } = useAuth();

    const handleButtonClick = async () => {
        if (onButtonClick) {
            onButtonClick();
            return;
        }

        // If user is logged in, show profile or sign out based on context
        if (user) {
            if (showProfile) {
                router.push('/profile');
            } else {
                // On profile page, go back home
                router.push('/');
            }
        } else {
            // Not logged in, go to login
            router.push('/login');
        }
    };

    // Determine button content based on auth state and page context
    const getButtonContent = () => {
        if (user) {
            if (showProfile) {
                return {
                    text: 'Profile',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    )
                };
            } else {
                return {
                    text: 'Home',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    )
                };
            }
        } else {
            return {
                text: 'Log In',
                icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                )
            };
        }
    };

    const buttonContent = getButtonContent();

    return (
        <header className="">
            <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-start">
                <div>
                    <h1 className="text-5xl font-bold mb-2">
                        hype<span className="text-purple-500">Tracker</span>
                    </h1>
                    <p>{subtitle}</p>
                </div>
                <button
                    onClick={handleButtonClick}
                    className="cursor-pointer px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                    {buttonContent.icon}
                    {buttonContent.text}
                </button>
            </div>
        </header>
    );
}