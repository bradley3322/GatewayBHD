'use client';
import React, { useEffect, useState } from 'react';
import styles from './letterR.module.scss';

const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:(!/\''.split('');

interface FlippingLetterProps {
    finalChar: string;
    delay: number;
}

export const FlippingLetter = ({ finalChar, delay }: FlippingLetterProps) => {
    const [currentChar, setCurrentChar] = useState(' ');
    const [flippingClass, setFlippingClass] = useState('');

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const startFlipping = () => {
            let currentIndex = 0;

            intervalId = setInterval(() => {
                if (finalChar.toUpperCase() === " ") {
                    setCurrentChar(' ');
                    clearInterval(intervalId);
                } else {
                    setCurrentChar(CHAR_SET[currentIndex]);
                }
                setFlippingClass(styles.flip);

                setTimeout(() => setFlippingClass(''), 300);

                if (CHAR_SET[currentIndex] === finalChar.toUpperCase()) {
                    clearInterval(intervalId);
                } else {
                    currentIndex = (currentIndex + 1) % CHAR_SET.length;
                }
            }, 50);
        };

        const delayTimeout = setTimeout(startFlipping, delay);

        return () => {
            clearInterval(intervalId);
            clearTimeout(delayTimeout);
        };
    }, [finalChar, delay]);

    return (
        <span className={`${styles.letter}`}>
            <span className={flippingClass}>{currentChar}</span>
        </span>
    );
};
