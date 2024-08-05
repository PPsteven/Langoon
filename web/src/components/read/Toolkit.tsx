import { Star, Sparkles } from 'lucide-react';

export const Toolkit = () => {
    return (
        <div className="border p-1 rounded-sm">
            <div className="flex flex-row gap-1 text-muted-foreground">
                <button>
                    <Star size={16}/>
                </button>
                <button>
                    <Sparkles size={16}/>
                </button>
            </div>
        </div>
    )    
}