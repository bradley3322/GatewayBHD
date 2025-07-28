'use client';
import { Flight } from '@/types/flights';
import BoardElement from './boardElement';
import { formatTime } from '@/utils/utils';
import { useState } from 'react';
import TitleCard from './titleCard';

export const BoardContainer = ({ flights }: { flights: Flight[] }) => {
    const [type, setType] = useState<'departure' | 'arrival'>('departure');

    console.log("Flights in BoardContainer:", flights);

    return (
        <div className="mt-10 mx-30 items-center justify-center">
            <TitleCard type={type} setType={setType} />

            <table className="w-full text-left">
                <thead>
                    <tr className='text-[#3a3a3a] font-light text-xl'>
                        <th className='font-medium'>Time</th>
                        <th className='font-medium'>Flight</th>
                        <th className='font-medium'>Airline</th>
                        <th className='font-medium'>{type === 'departure' ? 'To' : 'From'}</th>
                        <th className='font-medium'>Status</th>
                    </tr>
                </thead>
                <tbody>

                    {flights
                        .filter(flight => flight?.type === 'Airline')
                        .filter(flight => flight?.kind === type)
                        .map((flight, index) => (
                            <tr
                                key={index}
                                className=""
                            >
                                <td><BoardElement text={formatTime(flight?.estimated_off ?? '')} length={5} /></td>
                                <td><BoardElement text={flight?.ident} length={7} /></td>
                                <td><BoardElement text={flight?.operator ?? ''} length={3} /></td>
                                <td><BoardElement text={type === 'departure' ? flight?.destination?.name ?? '' : flight?.origin?.name ?? ''} length={20} /></td>
                                <td><BoardElement text={flight?.status.includes('Delayed') || flight?.status.includes('Gate Arrival') ? flight?.status.split(" / ")[1] : flight?.status} length={13} /></td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div >
    );
};
