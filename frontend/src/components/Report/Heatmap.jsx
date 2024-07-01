import { ResponsiveHeatMapCanvas } from '@nivo/heatmap'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const MyResponsiveHeatMapCanvas = ({ data /* see data tab */ }) => (
    <ResponsiveHeatMapCanvas
        data={data}
        margin={{ top: 70, right: 60, bottom: 20, left: 80 }}
        valueFormat=">-.2s"
        axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -90,
            legend: '',
            legendOffset: 46
        }}
        axisRight={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'country',
            legendPosition: 'middle',
            legendOffset: 40
        }}
        axisLeft={null}
        colors={{
            type: 'quantize',
            scheme: 'red_yellow_blue',
            steps: 10,
            minValue: -100000,
            maxValue: 100000
        }}
        emptyColor="#555555"
        borderWidth={1}
        borderColor="#000000"
        enableLabels={false}
        legends={[
            {
                anchor: 'left',
                translateX: -50,
                translateY: 0,
                length: 200,
                thickness: 10,
                direction: 'column',
                tickPosition: 'after',
                tickSize: 3,
                tickSpacing: 4,
                tickOverlap: false,
                tickFormat: '>-.2s',
                title: 'Value →',
                titleAlign: 'start',
                titleOffset: 4
            }
        ]}
        annotations={[]}
    />
)