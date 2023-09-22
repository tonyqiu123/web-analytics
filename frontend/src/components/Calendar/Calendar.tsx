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

    const [firstTrackingDate, setFirstTrackingDate] = useState(new Date());

    const getDomain = (url: string) => {
        const params = new URLSearchParams(new URL(url).search);
        return params.get("domain");
    }

    useEffect(() => {
        const fetchFirstDate = async () => {
            try {
                const response = await fetch(`http://localhost:5000/getFirstDate/?domain=${getDomain(window.location.href)}`);
                const dateString = await response.json();
                const firstTrackingDay = new Date(dateString);

                const dayBefore = new Date(firstTrackingDay);
                dayBefore.setDate(firstTrackingDay.getDate() - 1);
                setFirstTrackingDate(dayBefore)
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
        { from: new Date(Date.UTC(2022, 4, 29)), to: firstTrackingDate },
        { from: nextDay, to: new Date(Date.UTC(2024, 4, 29)) }
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
        />
    );
}

export default Calendar