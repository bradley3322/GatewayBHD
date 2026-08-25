'use client';
import React, { useState, useEffect } from 'react';
import { ArrowUpRightIcon, ArrowDownRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface TitleCardProps {
    type: 'DEPARTURE' | 'ARRIVAL' | 'OVERHEAD';
    setType?: (type: 'DEPARTURE' | 'ARRIVAL' | 'OVERHEAD') => void;
}


function TitleCard({ type, setType }: TitleCardProps) {
    const [currentText, setCurrentText] = useState(
        type === 'DEPARTURE' ? 'Departures' : type === 'ARRIVAL' ? 'Arrivals' : 'Overhead'
    );
    const [currentIconType, setCurrentIconType] = useState(type);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (type !== currentIconType) {
            setIsAnimating(true);

            const animationDuration = 300;

            const timer = setTimeout(() => {
                setCurrentText(
                    type === 'DEPARTURE' ? 'Departures' : type === 'ARRIVAL' ? 'Arrivals' : 'Overhead'
                );
                setCurrentIconType(type);
                setIsAnimating(false);
            }, animationDuration);

            return () => clearTimeout(timer);
        }
    }, [type, currentIconType]);

    const handleIconClick = () => {
        if (!setType) return;

        if (type === 'DEPARTURE') {
            setType('ARRIVAL');
        } else if (type === 'ARRIVAL') {
            setType('OVERHEAD');
        } else {
            setType('DEPARTURE');
        }
    };

    const getIcon = () => {
        if (currentIconType === 'DEPARTURE') {
            return <ArrowUpRightIcon className="w-10 h-10 text-green-500" />;
        }
        if (currentIconType === 'ARRIVAL') {
            return <ArrowDownRightIcon className="w-10 h-10 text-red-500" />;
        }
        return <ArrowRightIcon className="w-10 h-10 text-yellow-300" />;
    };

    return (
        <div className="flex flex-col gap-4 mb-4 text-white">
            <div className="flex flex-row items-center">
                <h1
                    className={`
                        text-5xl font-medium
                        transition-transform duration-500 ease-in-out
                        ${isAnimating ? '-rotate-x-90 opacity-0' : 'rotate-x-0 opacity-100'}
                    `}
                    style={{
                        transformOrigin:
                            type === 'DEPARTURE'
                                ? 'bottom center'
                                : type === 'ARRIVAL'
                                    ? 'top center'
                                    : 'center center',
                    }}
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
                    style={{
                        transformOrigin:
                            type === 'DEPARTURE'
                                ? 'bottom center'
                                : type === 'ARRIVAL'
                                    ? 'top center'
                                    : 'center center',
                    }}
                >
                    {getIcon()}
                </div>
            </div>
        </div>
    );
}

export default TitleCard;