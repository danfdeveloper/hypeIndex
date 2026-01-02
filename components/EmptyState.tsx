import Header from './Header';

import { useRouter } from 'next/navigation'



export default function EmptyState() {
    const router = useRouter()
    const goToLogin = () => {
        router.push('/login')
    }
    return (
        <div className="min-h-screen bg-black text-white">
            <Header title="hypeTracker" subtitle="Today's NBA games sorted by hype rating" onButtonClick={goToLogin} />
            <div className="flex items-center justify-center mt-20">
                <div className="text-xl text-gray-400">No games scheduled for today</div>
            </div>
        </div>
    );
}