'use client';
import React from 'react';
import styles from './letter.module.scss';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
interface LetterProps {
    text: string;
}

const Letter: React.FC<LetterProps> = ({ text }) => {

    return (
        <div className={styles.departureBoard}>
            {text.split('').map((char, index) => {
                const upperChar = char.toUpperCase();
                const className = CHARS.includes(upperChar)
                    ? `letter-${upperChar}`
                    : 'letterBlank';

                return (
                    <span
                        key={index}
                        className={`${styles.letter} ${styles[className]} ${styles[`animate-${index + 1}`]}`}
                    />
                );
            })}
        </div>
    );
};

export default Letter;