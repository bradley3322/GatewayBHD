'use client';
import { FlightBoardData } from '@/types/flights';
import BoardElement from './boardElement';
import { formatTime } from '@/utils/utils';
import { useState } from 'react';
import TitleCard from './titleCard';

export const BoardContainer = ({ flights }: { flights: FlightBoardData[] }) => {
    const [type, setType] = useState<'DEPARTURE' | 'ARRIVAL' | 'OVERHEAD'>('DEPARTURE');

    const visibleFlights = flights
        .filter(flight => flight?.type === 'Airline')
        .filter(flight => flight?.kind === type);

    // shared status text logic so mobile cards and desktop table stay in sync
    const getStatusText = (flight: FlightBoardData) => {
        if (!flight?.status) return '';
        return flight.status.includes('Delayed') || flight.status.includes('Gate Arrival')
            ? flight.status.split(" / ")[1] ?? flight.status
            : flight.status;
    };

    return (
        <div className="mt-10 mx-4 sm:mx-30 items-center justify-center">
            <TitleCard type={type} setType={setType} />

            {/* mobile stacked cards */}
            <div className="flex flex-col gap-3 sm:hidden">
                {visibleFlights.map((flight, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-3 overflow-hidden">
                        <div className="flex flex-wrap items-center gap-4 justify-between">
                            <BoardElement text={formatTime(flight?.estimated_off ?? '')} length={5} />
                            <BoardElement text={flight?.ident} length={7} />
                        </div>
                        <div className="mt-2">
                            <BoardElement text={flight?.operator ?? ''} length={3} />
                        </div>
                        <div className="mt-2 overflow-x-auto">
                            <BoardElement text={type === 'DEPARTURE' ? flight?.destination?.name ?? '' : flight?.origin?.name ?? ''} length={12} />
                        </div>
                        <div className="mt-2">
                            <BoardElement text={getStatusText(flight)} length={10} />
                        </div>
                    </div>
                ))}
            </div>

            {/* tablet card grid */}
            <div className="hidden sm:grid lg:hidden grid-cols-2 gap-3">
                {visibleFlights.map((flight, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-3 overflow-hidden">
                        <div className="flex flex-wrap items-center gap-4 justify-between">
                            <BoardElement text={formatTime(flight?.estimated_off ?? '')} length={5} />
                            <BoardElement text={flight?.ident} length={7} />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-4 justify-between">
                            <BoardElement text={flight?.operator ?? ''} length={3} />
                            <BoardElement text={getStatusText(flight)} length={10} />
                        </div>
                        <div className="mt-2 overflow-x-auto">
                            <BoardElement text={type === 'DEPARTURE' ? flight?.destination?.name ?? '' : flight?.origin?.name ?? ''} length={14} />
                        </div>
                    </div>
                ))}
            </div>

            {/* desktop table */}
            <table className="hidden lg:table w-full text-left">
                <thead>
                    <tr className='text-[#3a3a3a] font-light text-xl'>
                        <th className='font-medium'>Time</th>
                        <th className='font-medium'>Flight</th>
                        <th className='font-medium'>Airline</th>
                        <th className='font-medium'>{type === 'DEPARTURE' ? 'To' : 'From'}</th>
                        <th className='font-medium'>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleFlights.map((flight, index) => (
                        <tr
                            key={index}
                            className=""
                        >
                            <td><BoardElement text={formatTime(flight?.estimated_off ?? '')} length={5} /></td>
                            <td><BoardElement text={flight?.ident} length={7} /></td>
                            <td><BoardElement text={flight?.operator ?? ''} length={3} /></td>
                            <td><BoardElement text={type === 'DEPARTURE' ? flight?.destination?.name ?? '' : flight?.origin?.name ?? ''} length={20} /></td>
                            <td><BoardElement text={getStatusText(flight)} length={13} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
};
