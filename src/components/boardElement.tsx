'use client';

import { FlippingLetter } from "./flippingLetter";

interface BoardElementProps {
    text: string;
    length?: number;
    className?: string;
}

export const BoardElement = ({ text, length = text.length, className = '' }: BoardElementProps) => {
    const paddedText = text.padEnd(length, ' ');
    return (
        <div className={`flex items-center mb-4 min-w-0 ${className}`}>
            {paddedText.split('').map((char, i) => (
                i < length ? (
                    <FlippingLetter
                        key={i} finalChar={char} delay={i * 150} />
                ) : null
            ))}
        </div>
    )
}

export default BoardElement;