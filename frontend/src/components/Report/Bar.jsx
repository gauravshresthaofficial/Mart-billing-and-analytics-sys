// / install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bar
import { ResponsiveBar } from '@nivo/bar'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
// const data = [
//     {
//         "country": "AD",
//         "hot dog": 115,
//         "hot dogColor": "hsl(14, 70%, 50%)",
//         "burger": 96,
//         "burgerColor": "hsl(181, 70%, 50%)",
//         "sandwich": 99,
//         "sandwichColor": "hsl(297, 70%, 50%)",
//         "kebab": 142,
//         "kebabColor": "hsl(122, 70%, 50%)",
//         "fries": 200,
//         "friesColor": "hsl(31, 70%, 50%)",
//         "donut": 133,
//         "donutColor": "hsl(121, 70%, 50%)"
//     },
//     {
//         "country": "AE",
//         "hot dog": 57,
//         "hot dogColor": "hsl(147, 70%, 50%)",
//         "burger": 118,
//         "burgerColor": "hsl(309, 70%, 50%)",
//         "sandwich": 113,
//         "sandwichColor": "hsl(280, 70%, 50%)",
//         "kebab": 103,
//         "kebabColor": "hsl(254, 70%, 50%)",
//         "fries": 16,
//         "friesColor": "hsl(199, 70%, 50%)",
//         "donut": 65,
//         "donutColor": "hsl(248, 70%, 50%)"
//     },
//     {
//         "country": "AF",
//         "hot dog": 189,
//         "hot dogColor": "hsl(71, 70%, 50%)",
//         "burger": 171,
//         "burgerColor": "hsl(289, 70%, 50%)",
//         "sandwich": 111,
//         "sandwichColor": "hsl(46, 70%, 50%)",
//         "kebab": 174,
//         "kebabColor": "hsl(307, 70%, 50%)",
//         "fries": 103,
//         "friesColor": "hsl(297, 70%, 50%)",
//         "donut": 195,
//         "donutColor": "hsl(37, 70%, 50%)"
//     },
//     {
//         "country": "AG",
//         "hot dog": 45,
//         "hot dogColor": "hsl(107, 70%, 50%)",
//         "burger": 199,
//         "burgerColor": "hsl(312, 70%, 50%)",
//         "sandwich": 179,
//         "sandwichColor": "hsl(37, 70%, 50%)",
//         "kebab": 119,
//         "kebabColor": "hsl(345, 70%, 50%)",
//         "fries": 136,
//         "friesColor": "hsl(277, 70%, 50%)",
//         "donut": 9,
//         "donutColor": "hsl(63, 70%, 50%)"
//     },
//     {
//         "country": "AI",
//         "hot dog": 153,
//         "hot dogColor": "hsl(95, 70%, 50%)",
//         "burger": 163,
//         "burgerColor": "hsl(156, 70%, 50%)",
//         "sandwich": 68,
//         "sandwichColor": "hsl(89, 70%, 50%)",
//         "kebab": 154,
//         "kebabColor": "hsl(188, 70%, 50%)",
//         "fries": 24,
//         "friesColor": "hsl(22, 70%, 50%)",
//         "donut": 88,
//         "donutColor": "hsl(151, 70%, 50%)"
//     },
//     {
//         "country": "AL",
//         "hot dog": 145,
//         "hot dogColor": "hsl(335, 70%, 50%)",
//         "burger": 160,
//         "burgerColor": "hsl(69, 70%, 50%)",
//         "sandwich": 185,
//         "sandwichColor": "hsl(21, 70%, 50%)",
//         "kebab": 16,
//         "kebabColor": "hsl(163, 70%, 50%)",
//         "fries": 2,
//         "friesColor": "hsl(327, 70%, 50%)",
//         "donut": 192,
//         "donutColor": "hsl(23, 70%, 50%)"
//     },
//     {
//         "country": "AM",
//         "hot dog": 76,
//         "hot dogColor": "hsl(119, 70%, 50%)",
//         "burger": 172,
//         "burgerColor": "hsl(320, 70%, 50%)",
//         "sandwich": 25,
//         "sandwichColor": "hsl(131, 70%, 50%)",
//         "kebab": 140,
//         "kebabColor": "hsl(164, 70%, 50%)",
//         "fries": 109,
//         "friesColor": "hsl(180, 70%, 50%)",
//         "donut": 84,
//         "donutColor": "hsl(90, 70%, 50%)"
//     }
// ]
export const MyResponsiveBar = ({ data, keys, leftLegend, bottomLegend, indexBy, enableTotals=false, colors, groupMode="grouped" }) => (
    <ResponsiveBar
        data={data}
        keys= {keys}
        indexBy={indexBy}
        margin={{ top: 20, right: 130, bottom: 50, left: 100 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={colors || {scheme: "nivo"}}
        groupMode={groupMode}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#0328fc',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#0328fc',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'fries'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'sandwich'
                },
                id: 'lines'
            }
        ]}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: bottomLegend,
            legendPosition: 'middle',
            legendOffset: 32,
            truncateTickAt: 0
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: leftLegend,
            legendPosition: 'middle',
            legendOffset: -80,
            truncateTickAt: 0
        }}
        enableTotals={enableTotals}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#000000"
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'top-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={e => e.id + ": " + e.formattedValue + " in country: " + e.indexValue}
    />
)