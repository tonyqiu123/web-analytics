import React, { useEffect, useState } from 'react';
import 'react-day-picker/dist/style.css';
import './Calendar.css'

import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';

type CalendarProps = {
    selected: Date
    setSelected: React.Dispatch<React.SetStateAction<any>>;
}

const Calendar: React.FC<CalendarProps> = ({ selected, setSelected }) => {

    const [firstTrackingDate, setFirstTrackingDate] = useState({
        firstDay: new Date(),
        lastDay: new Date()
    });

    const getDomain = (url: string) => {
        const params = new URLSearchParams(new URL(url).search);
        return params.get("domain");
    }

    useEffect(() => {
        const fetchFirstDate = async () => {
            try {
                const response = await fetch(`http://localhost:5000/getFirstDate/?domain=${getDomain(window.location.href)}`);
                // const response = await fetch(`https://web-analytics-production.up.railway.app/getFirstDate/?domain=${getDomain(window.location.href)}`);
                const dateString = await response.json();
                const firstTrackingDay = new Date(dateString.firstDay);
                const lastTrackingDay = new Date(dateString.lastDay);

                firstTrackingDay.setDate(firstTrackingDay.getDate());
                lastTrackingDay.setDate(lastTrackingDay.getDate() + 2);
                console.log(firstTrackingDay)

                setFirstTrackingDate({
                    firstDay: firstTrackingDay,
                    lastDay: lastTrackingDay
                })
            } catch (err) {
                console.error(err);
            }
        }

        fetchFirstDate()
    }, [])

    const currentDate = new Date();
    const nextDay = new Date(currentDate);
    nextDay.setUTCDate(currentDate.getUTCDate() + 1);

    const disabledDays = [

        { from: new Date(Date.UTC(2022, 4, 29)), to: firstTrackingDate.firstDay },
        { from: firstTrackingDate.lastDay, to: new Date(Date.UTC(2024, 4, 29)) }
    ];

    let footer = <p>Please pick a day.</p>;
    if (selected) {
        footer = <p>Selected: {format(selected, 'PP')}.</p>;
    }
    return (
        <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            footer={footer}
            disabled={disabledDays}
            today={new Date()}
        />
    );
}

export default Calendar