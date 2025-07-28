'use client';
import React, { useState, useEffect } from 'react';
import { ArrowUpRightIcon, ArrowDownRightIcon } from '@heroicons/react/24/outline';

interface TitleCardProps {
    type: 'departure' | 'arrival';
    setType?: (type: 'departure' | 'arrival') => void;
}


function TitleCard({ type, setType }: TitleCardProps) {
    const [currentText, setCurrentText] = useState(type === 'departure' ? 'Departures' : 'Arrivals');
    const [currentIconType, setCurrentIconType] = useState(type);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (type !== currentIconType) {
            setIsAnimating(true);

            const animationDuration = 300;

            const timer = setTimeout(() => {
                setCurrentText(type === 'departure' ? 'Departures' : 'Arrivals');
                setCurrentIconType(type);
                setIsAnimating(false);
            }, animationDuration);

            return () => clearTimeout(timer);
        }
    }, [type, currentIconType]);

    const handleIconClick = () => {
        if (setType) {
            setType(type === 'departure' ? 'arrival' : 'departure');
        }
    };

    return (
        <div className="flex flex-row items-center mb-4 text-white">
            <h1
                className={`
                    text-5xl font-medium
                    transition-transform duration-500 ease-in-out
                    ${isAnimating ? '-rotate-x-90 opacity-0' : 'rotate-x-0 opacity-100'}
                `}
                style={{ transformOrigin: type === 'departure' ? 'bottom center' : 'top center' }}
            >
                {currentText}
            </h1>

            <div
                className={`
                    flex items-center gap-2 ml-4 cursor-pointer
                    transition-transform duration-500 ease-in-out
                    ${isAnimating ? '-rotate-x-90 opacity-0' : 'rotate-x-0 opacity-100'}
                `}
                onClick={handleIconClick}
                style={{ transformOrigin: type === 'departure' ? 'bottom center' : 'top center' }}
            >
                {currentIconType === 'departure' ? (
                    <ArrowUpRightIcon className="w-10 h-10 text-green-500" />
                ) : (
                    <ArrowDownRightIcon className="w-10 h-10 text-red-500" />
                )}
            </div>
        </div>
    );
}

export default TitleCard;