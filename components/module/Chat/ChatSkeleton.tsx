function SkeletonBlock({ className }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-gray-200 ${className ?? ""}`}
        />
    );
}

function AvatarSkeleton() {
    return (
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
    );
}

function UserMessage() {
    return (
        <div className="flex gap-4 flex-row-reverse items-start">
            <AvatarSkeleton />
            <div className="flex flex-col items-end gap-2 max-w-[80%]">
                <div className="bg-gray-100 animate-pulse rounded-2xl rounded-tr-none px-4 py-3 flex flex-col gap-2 min-w-[160px]">
                    <SkeletonBlock className="h-3 w-48" />
                    <SkeletonBlock className="h-3 w-36" />
                </div>
                <SkeletonBlock className="h-2 w-12 rounded" />
            </div>
        </div>
    );
}

function AIMessage() {
    return (
        <div className="flex gap-4 items-start">
            <AvatarSkeleton />
            <div className="flex flex-col gap-2 max-w-[80%]">
                <div className="bg-gray-100 border border-gray-100 animate-pulse rounded-2xl rounded-tl-none px-4 py-3 flex flex-col gap-2">
                    <SkeletonBlock className="h-3 w-64" />
                    <SkeletonBlock className="h-3 w-52" />
                    <SkeletonBlock className="h-3 w-40" />
                </div>
                <SkeletonBlock className="h-2 w-12 rounded" />
            </div>
        </div>
    );
}

function AICardMessage() {
    return (
        <div className="flex gap-4 items-start">
            <AvatarSkeleton />
            <div className="flex flex-col gap-2 max-w-[80%] w-full">
                <div className="bg-gray-100 border border-gray-100 rounded-2xl rounded-tl-none p-4 flex flex-col gap-3">
                    <SkeletonBlock className="h-4 w-48" />
                    <SkeletonBlock className="h-3 w-full" />
                    <SkeletonBlock className="h-3 w-5/6" />
                    <div className="flex flex-col gap-2 pt-1">
                        <SkeletonBlock className="h-9 w-full rounded-lg" />
                        <SkeletonBlock className="h-9 w-full rounded-lg" />
                        <SkeletonBlock className="h-9 w-4/5 rounded-lg" />
                    </div>
                </div>
                <SkeletonBlock className="h-2 w-12 rounded" />
            </div>
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="flex gap-4 animate-pulse items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="bg-gray-100 h-12 w-48 rounded-2xl rounded-tl-none" />
        </div>
    );
}

export default function ChatSkeleton() {
    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
                <AIMessage />
                <UserMessage />
                <AICardMessage />
                <UserMessage />
                <TypingIndicator />
            </div>
        </div>
    );
}
