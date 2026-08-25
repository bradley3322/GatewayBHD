'use client';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './letterR.module.scss';

const BASE_CHAR_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-:(!/'";

const buildCharSet = (text: string) => {
    const chars = new Set<string>(BASE_CHAR_SET.split(''));
    for (const char of text.toUpperCase()) {
        if (char !== ' ') {
            chars.add(char);
        }
    }
    return Array.from(chars);
};

interface FlippingLetterProps {
    finalChar: string;
    delay: number;
}

export const FlippingLetter = ({ finalChar, delay }: FlippingLetterProps) => {
    const [currentChar, setCurrentChar] = useState(' ');
    const [flippingClass, setFlippingClass] = useState('');

    const CHAR_SET = useMemo(() => buildCharSet(finalChar), [finalChar]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const startFlipping = () => {
            let currentIndex = 0;

            intervalId = setInterval(() => {
                if (finalChar.toUpperCase() === ' ') {
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
    }, [CHAR_SET, delay, finalChar]);

    return (
        <span className={`${styles.letter}`}>
            <span className={flippingClass}>{currentChar}</span>
        </span>
    );
};
