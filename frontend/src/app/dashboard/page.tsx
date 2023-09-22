"use client"

import Card from "@/components/Card/Card"
import DataIndicator from "@/components/DataIndicator/DataIndicator"
import { NavBar } from "@/components/NavBar/NavBar"
import SimpleAreaLineChart from "@/components/SimpleAreaLineChart/SimpleAreaLineChart"
import SimpleBarChart from "@/components/SimpleBarChart/SimpleBarChart"
import { useEffect, useState } from "react"
import WorldMap from "react-svg-worldmap";
import Separator from "@/components/Separator/Separator"
import Tooltip from "@/components/Tooltip/Tooltip"
import Select from "@/components/Select/Select"
import Calendar from '@/components/Calendar/Calendar'
import Button from "@/components/Button/Button"
import Popover from "@/components/Popover/Popover"
import { format } from 'date-fns';
import Loading from "@/components/Loading/Loading"

const Dashboard: React.FC = () => {

    const currentDate = new Date();

    const [selectedHourlyStat, setSelectedHourlyStat] = useState('uniqueVisits')
    const [trackingDomain, setTrackingDomain] = useState<string | null>('')
    const [showChangeDateModal, setShowChangeDateModal] = useState(false)
    const [date, setDate] = useState<Date>(currentDate)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [data, setData] = useState<any>({
        domain: "example.com",
        visits: 0,
        bounceVisit: 0,
        visitDuration: 0,
        uniqueVisits: 0
    })
    const [hourlyTrafficData, setHourlyTrafficData] = useState<any[] | null>(null)

    const hourlyTrafficTypes = ['uniqueVisits', 'visits', 'visitDuration', 'bounceVisit']

    const getDomain = (url: string) => {
        const params = new URLSearchParams(new URL(url).search);
        return params.get("domain");
    }

    async function fetchData() {
        try {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
            const day = String(date.getDate()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;
            setIsLoading(true)
            // const response = await fetch(`http://localhost:5000/?domain=${getDomain(window.location.href)}&date=${formattedDate}`);
            const response = await fetch(`https://web-analytics-production.up.railway.app/?domain=${getDomain(window.location.href)}&date=${formattedDate}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const fetchedData = await response.json();
            const accumulatedData = fetchedData.hourlyTraffic.reduce((accumulator: any, current: any) => {
                accumulator.visits += current.visits;
                accumulator.bounceVisit += current.bounceVisit;
                accumulator.visitDuration += current.visitDuration;
                accumulator.uniqueVisits += current.uniqueVisits;
                return accumulator;

            }, {
                domain: "example.com",
                visits: 0,
                bounceVisit: 0,
                visitDuration: 0,
                uniqueVisits: 0
            });
            accumulatedData.countryData = fetchedData.countryData
            accumulatedData.sourceData = fetchedData.sourceData
            accumulatedData.pageData = fetchedData.pageData
            accumulatedData.deviceData = fetchedData.deviceData

            setData(accumulatedData);
            setHourlyTrafficData(fetchedData.hourlyTraffic)
            setIsLoading(false)

        } catch (error) {
            setIsLoading(false)
            console.error('Fetch error:', error);
        }
    }

    useEffect(() => {
        fetchData();
        setTrackingDomain(getDomain(window.location.href))
    }, [date])

    return (
        <>
            <NavBar>
                <div className="row" style={{ maxWidth: '2000px', gap: '16px', display: 'flex', margin: 'auto', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <h1 className="magic-text">{trackingDomain}</h1>
                    <div className="row" style={{ width: 'fit-content', alignItems: 'center', gap: '16px' }}>
                        {date &&
                            <h4>{format(date, 'PP')} UTC Time</h4>
                        }
                        <Popover isOpen={showChangeDateModal} setIsOpen={setShowChangeDateModal}>
                            <Button text="Change date" variant="primary" />
                            <div style={{ backgroundColor: 'white', border: '1px solid #E2E2E2', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
                                <Calendar selected={date} setSelected={setDate} />
                            </div>
                        </Popover>
                    </div>
                </div>
            </NavBar>
            <main className="dashboard" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', width: '100%', maxWidth: '2000px', margin: 'auto', padding: '24px' }}>

                <Card className="dashboard-grid" style={{ gridColumn: 'span 2', gap: '24px' }}>
                    <div className="row" style={{ justifyContent: 'space-between' }}>

                        <Separator style={{ opacity: '0' }} orientation="v" />
                        <div className="column" style={{ width: 'fit-content', gap: '2px' }}>
                            <Tooltip toolTipText="Total number of visits where the source is NOT from the tracked domain">
                                <h6 style={{ whiteSpace: "nowrap" }}>UNIQUE VISITS</h6>
                            </Tooltip>
                            {!isLoading && hourlyTrafficData ?
                                <DataIndicator text="from yesterday" currentData={data.uniqueVisits} previousData={40} />
                                : <Loading style={{ marginTop: '12px' }} />
                            }
                        </div>

                        <Separator orientation="v" />

                        <div className="column" style={{ width: 'fit-content', gap: '2px' }}>
                            <Tooltip toolTipText="Total visits of all pages combined">
                                <h6 style={{ whiteSpace: "nowrap" }}>TOTAL PAGE VISITS</h6>
                            </Tooltip>
                            {!isLoading && hourlyTrafficData ?
                                <DataIndicator text="from yesterday" currentData={data.visits} previousData={40} />
                                : <Loading style={{ marginTop: '12px' }} />
                            }
                        </div>
                        <Separator orientation="v" />
                        <div className="column" style={{ width: 'fit-content', gap: '2px' }}>
                            <Tooltip toolTipText="The average number of pages viewed per unique visit">
                                <h6 style={{ whiteSpace: "nowrap" }}>AVERAGE PAGE VIEWS PER UNIQUE VISIT</h6>
                            </Tooltip>
                            {!isLoading && hourlyTrafficData ?
                                <DataIndicator text="from yesterday" currentData={data.visits / data.uniqueVisits} previousData={40} />
                                : <Loading style={{ marginTop: '12px' }} />
                            }
                        </div>
                        <Separator orientation="v" />
                        <div className="column" style={{ width: 'fit-content', gap: '2px' }}>
                            <Tooltip toolTipText="Percent of unique visits where the user clicks on the webpage">
                                <h6 style={{ whiteSpace: "nowrap" }}>BOUNCE RATE</h6>
                            </Tooltip>
                            {!isLoading && hourlyTrafficData ?
                                <DataIndicator percent={true} text="from yesterday" currentData={data.bounceVisit * 100 / data.visits} previousData={40} />
                                : <Loading style={{ marginTop: '12px' }} />
                            }
                        </div>
                        <Separator orientation="v" />
                        <div className="column" style={{ width: 'fit-content', gap: '2px' }}>
                            <Tooltip toolTipText="Average duration of a unique visit in seconds">
                                <h6 style={{ whiteSpace: "nowrap" }}>AVERAGE UNIQUE VISIT DURATION</h6>
                            </Tooltip>
                            {!isLoading && hourlyTrafficData ?
                                <DataIndicator text="from yesterday" currentData={data.visitDuration / data.uniqueVisits} previousData={40} />
                                : <Loading style={{ marginTop: '12px' }} />
                            }
                        </div>
                        <Separator orientation="v" style={{ opacity: '0' }} />

                    </div>
                    <Separator orientation="h" />
                    <div className="row" style={{ gap: '12px', alignItems: 'center' }}>
                        <h3>Showing data for: </h3>
                        <Select queries={hourlyTrafficTypes} selected={selectedHourlyStat} setSelected={setSelectedHourlyStat} />
                    </div>

                    <div style={{ height: '400px' }}>
                        {!isLoading && hourlyTrafficData ?
                            <SimpleAreaLineChart type={selectedHourlyStat} data={hourlyTrafficData} />
                            : <Loading style={{ height: '400px' }} />}
                    </div>
                </Card>

                <Card style={{ gap: '12px', alignItems: 'center' }}>
                    {!isLoading && data.sourceData ?
                        <>
                            <Tooltip toolTipText="Top visitor sources. ">
                                <h2>Top Source</h2>
                            </Tooltip>
                            <div className="column" style={{ gap: '2px' }}>
                                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p>Source</p>
                                    <p>Visitors</p>
                                </div>
                                <Separator orientation="h" style={{ margin: '6px 0' }} />
                                {data.sourceData.map((data: any, index: any) => {
                                    return (
                                        <div key={index} className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p>{data.name}</p>
                                            <h4>{data.value}</h4>
                                        </div>
                                    )
                                })}
                                <div style={{ height: '400px', marginTop: '24px' }}>
                                    <SimpleBarChart data={data.sourceData} />
                                </div>
                            </div>
                        </>
                        : <Loading style={{ height: '400px' }} />}
                </Card>

                <Card style={{ gap: '12px', alignItems: 'center' }}>
                    {!isLoading && data.pageData ?
                        <>
                            <Tooltip toolTipText="Top visited pages.">
                                <h2>Top Pages</h2>
                            </Tooltip>
                            <div className="column" style={{ gap: '2px' }}>

                                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p>Page</p>
                                    <p>Visitors</p>
                                </div>
                                <Separator orientation="h" style={{ margin: '6px 0' }} />
                                {data.pageData.map((data: any, index: any) => {
                                    return (
                                        <div key={index} className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p>{data.name}</p>
                                            <h4>{data.value}</h4>
                                        </div>
                                    )
                                })}

                                <div style={{ height: '400px', marginTop: '24px' }}>
                                    <SimpleBarChart data={data.pageData} />
                                </div>

                            </div>
                        </>
                        : <Loading style={{ height: '400px' }} />}

                </Card>

                <Card style={{ gap: '12px', alignItems: 'center' }}>
                    {!isLoading && data.countryData ?
                        <>
                            <Tooltip toolTipText="Data source for global visitor insights.">
                                <h2>Countries</h2>
                            </Tooltip>
                            <WorldMap
                                color="#69b4df"
                                value-suffix="people"
                                size="lg"
                                data={data.countryData}
                            />

                            <div className="column" style={{ gap: '2px' }}>

                                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p>Country</p>
                                    <p>Visitors</p>
                                </div>
                                <Separator orientation="h" style={{ margin: '6px 0' }} />
                                {data?.countryData.map((data: any, index: any) => {
                                    return (
                                        <div key={index} className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p>{data.country}</p>
                                            <h4>{data.value}</h4>
                                        </div>
                                    )
                                })}

                            </div>
                        </>

                        : <Loading style={{ height: '400px' }} />}

                </Card>


                <Card style={{ gap: '12px', alignItems: 'center' }}>
                    {!isLoading && data.deviceData ?
                        <>
                            <Tooltip toolTipText="Top visitor devices.">
                                <h2>Devices</h2>
                            </Tooltip>
                            <div className="column" style={{ gap: '2px' }}>

                                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p>Device</p>
                                    <p>Visitors</p>
                                </div>
                                <Separator orientation="h" style={{ margin: '6px 0' }} />
                                {data?.deviceData.map((data: any, index: any) => {
                                    return (
                                        <div key={index} className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p>{data.name}</p>
                                            <h4>{data.value}</h4>
                                        </div>
                                    )
                                })}


                                <div style={{ height: '400px', marginTop: '24px' }}>
                                    <SimpleBarChart data={data?.deviceData} />
                                </div>

                            </div>
                        </>

                        : <Loading style={{ height: '400px' }} />}
                </Card>
            </main>
        </>
    )
}

export default Dashboard