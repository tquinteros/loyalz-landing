"use client"
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const NotFoundRedirect = () => {
    const router = useRouter();

    const [timer, setTimer] = useState(3);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(timer - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    if (timer === 0) {
        router.push('/');
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle>Page not found</CardTitle>
                        <CardDescription>
                            You will be redirected to the home page in {timer} seconds.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}

export default NotFoundRedirect;