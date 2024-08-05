import { useState } from "react"

export const useLoading = <T>(
    p: (...arg: any[]) => Promise<T>,
    initial?: boolean,
) => {
    const [isLoading, setIsLoading] = useState(initial ?? false);
    const data = async (...arg: any[]) => {
        setIsLoading(true);
        return await p(...arg);
    }
    return {
        isLoading,
        data,
    }
}