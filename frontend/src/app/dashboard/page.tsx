"use client"

import Card from "@/components/Card/Card"
import DataIndicator from "@/components/DataIndicator/DataIndicator"
import { NavBar } from "@/components/NavBar/NavBar"
import SimpleAreaLineChart from "@/components/SimpleAreaLineChart/SimpleAreaLineChart"
import SimpleBarChart from "@/components/SimpleBarChart/SimpleBarChart"
import { useEffect, useState } from "react"
import WorldMap from "react-svg-worldmap";
import useFormattedCurrentDate from "@/hooks/useCurrentDate"
import Separator from "@/components/Separator/Separator"
import Tooltip from "@/components/Tooltip/Tooltip"
import Select from "@/components/Select/Select"

const Dashboard: React.FC = () => {

    const [selectedHourlyStat, setSelectedHourlyStat] = useState('uniqueVisits')

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

    const domain = getDomain(window.location.href)

    async function fetchData() {
        try {
            const currentDate = new Date();
            const year = currentDate.getUTCFullYear();
            const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0'); // Adding 1 because months are 0-indexed
            const day = String(currentDate.getUTCDate()).padStart(2, '0');

            const date = `${year}-${month}-${day}T00:00:00Z`;
            const response = await fetch(`http://localhost:5000/?domain=${getDomain(window.location.href)}&date=${date}`);
            // const response = await fetch(`https://web-analytics-production.up.railway.app/?domain=${getDomain(window.location.href)}&date=${date}`);


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

            }, { ...data });
            accumulatedData.countryData = fetchedData.countryData
            accumulatedData.sourceData = fetchedData.sourceData
            accumulatedData.pageData = fetchedData.pageData
            accumulatedData.deviceData = fetchedData.deviceData

            setData(accumulatedData);
            setHourlyTrafficData(fetchedData.hourlyTraffic)

        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
    }, [data, hourlyTrafficData])

    return (
        <>
            <NavBar>
                <div className="row" style={{ margin: 'auto', maxWidth: '2000px', justifyContent: 'space-between' }}>
                    <h2>Tony&apos;s Web Analytics</h2>
                </div>
            </NavBar>
            <div style={{ height: '48px' }}></div>
            <main className="dashboard" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', width: '100%', maxWidth: '2000px', margin: 'auto' }}>
                <div className="column" style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between' }}>
                    <h1>{useFormattedCurrentDate().split("T")[0]}</h1>
                    <h1>Traffic of: {domain}</h1>
                </div>

                <Card className="dashboard-grid" style={{ gridColumn: 'span 2', gap: '24px' }}>
                    <div className="row" style={{ justifyContent: 'space-between' }}>


                        <div className="column" style={{ width: 'fit-content', gap: '2px' }}>
                            <Tooltip toolTipText="Total number of visits where the source is NOT from the tracked domain">
                                <h6 style={{ whiteSpace: "nowrap" }}>UNIQUE VISITS</h6>
                            </Tooltip>
                            <DataIndicator text="from yesterday" currentData={data.uniqueVisits} previousData={40} />
                        </div>

                        <div className="column" style={{ width: 'fit-content', gap: '2px' }}>
                            <Tooltip toolTipText="Total visits of all pages combined">
                                <h6 style={{ whiteSpace: "nowrap" }}>TOTAL PAGE VISITS</h6>
                            </Tooltip>
                            <DataIndicator text="from yesterday" currentData={data.visits} previousData={40} />
                        </div>

                        <div className="column" style={{ width: 'fit-content', gap: '2px' }}>
                            <Tooltip toolTipText="The average number of pages viewed per unique visit">
                                <h6 style={{ whiteSpace: "nowrap" }}>AVERAGE PAGE VIEWS PER UNIQUE VISIT</h6>
                            </Tooltip>
                            <DataIndicator text="from yesterday" currentData={data.visits / data.uniqueVisits} previousData={40} />
                        </div>

                        <div className="column" style={{ width: 'fit-content', gap: '2px' }}>
                            <Tooltip toolTipText="Percent of unique visits where the user clicks on the webpage">
                                <h6 style={{ whiteSpace: "nowrap" }}>BOUNCE RATE</h6>
                            </Tooltip>
                            <DataIndicator percent={true} text="from yesterday" currentData={data.bounceVisit * 100 / data.visits} previousData={40} />
                        </div>
                        <div className="column" style={{ width: 'fit-content', gap: '2px' }}>
                            <Tooltip toolTipText="Average duration of a unique visit in seconds">
                                <h6 style={{ whiteSpace: "nowrap" }}>AVERAGE UNIQUE VISIT DURATION</h6>
                            </Tooltip>
                            <DataIndicator text="from yesterday" currentData={data.visitDuration / data.uniqueVisits} previousData={40} />
                        </div>

                    </div>
                    <Select queries={hourlyTrafficTypes} selected={selectedHourlyStat} setSelected={setSelectedHourlyStat} />
                    <div style={{ height: '400px' }}>
                        {hourlyTrafficData ?
                            <SimpleAreaLineChart type={selectedHourlyStat} data={hourlyTrafficData} />
                            : <h1>Loading</h1>}
                    </div>

                </Card>

                <Card style={{ gap: '12px', alignItems: 'center' }}>
                    {data.sourceData ?
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
                        : <h1>Loading</h1>}
                </Card>

                <Card style={{ gap: '12px', alignItems: 'center' }}>
                    {data.pageData ?
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
                        : <h1>Loading</h1>}

                </Card>

                <Card style={{ gap: '12px', alignItems: 'center' }}>
                    {data.countryData ?
                        <>
                            <Tooltip toolTipText="Data source for global visitor insights.">
                                <h2>Countries</h2>
                            </Tooltip>
                            <WorldMap
                                color="#0582CA"
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

                        : <h1>Loading</h1>}

                </Card>


                <Card style={{ gap: '12px', alignItems: 'center' }}>
                    {data.deviceData ?
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

                        : <h1>Loading</h1>}
                </Card>

            </main>
        </>

    )
}

export default Dashboard