interface HeaderProps {
    title: string;
    subtitle: string;
    onButtonClick: () => void;
}

export default function Header({ title, subtitle, onButtonClick }: HeaderProps) {
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
                    onClick={onButtonClick}
                    className="cursor-pointer px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Log In
                </button>
            </div>
        </header>
    );
}