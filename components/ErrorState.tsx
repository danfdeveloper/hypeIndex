interface ErrorStateProps {
    message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
                <div className="text-2xl text-red-500 mb-4">Error</div>
                <div className="text-gray-400">{message}</div>
            </div>
        </div>
    );
}