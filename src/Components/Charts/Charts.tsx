
import React from "react";
import {
    Svg, Circle, Rect, G,
    Line, Text, Path
} from "react-native-svg";


import * as d3 from "d3";
import { BarContent, LineContent } from "./ChartContent";


interface Props {
    height: number;
    width: number;
    data: number[];
    max: number;
    barFill?: string;
    barStroke?: string;
    strokeWidth? : number;
    spacing?: number;
    xAxisMargin: number;
    yAxisMargin: number;
    outerMargin?: number;
}

interface State {

}


export class BarChart extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    height = () => {
        return this.props.height - 25;
    }

    width = () => {
        return this.props.width - 25;
    }

    render = () => {
        const { height: propsHeight, width: propsWidth } = this.props;
        return (
            <Svg
                height={propsHeight}
                width={propsWidth}
                viewBox={[0, 0, propsWidth, propsHeight].join(" ")}
            >
                    <BarContent
                        xPos={this.props.yAxisMargin + this.chartMargin()}
                        yPos={0 + this.chartMargin()}
                        height={this.props.height - this.props.xAxisMargin - 2 * this.chartMargin()}
                        width={this.props.width - this.props.yAxisMargin - 2 * this.chartMargin()}
                        data={this.props.data}
                        max={this.props.max}
                        barFill={this.props.barFill}
                        barStroke={this.props.barStroke}
                        strokeWidth={this.props.strokeWidth}
                        spacing={this.props.spacing}
                    ></BarContent>
                    <XAxis
                        x1={this.props.yAxisMargin + this.chartMargin()}
                        x2={this.props.width - this.chartMargin()}
                        y={this.props.height - this.props.xAxisMargin - this.chartMargin()}
                    ></XAxis>
                    <YAxis
                        y1={this.chartMargin()}
                        y2={this.props.height - this.props.xAxisMargin - this.chartMargin()}
                        x={this.props.yAxisMargin + this.chartMargin()}
                    ></YAxis>
            </Svg>
        );
    }

    private padding = () => {
        const padding = this.props.spacing ? this.props.spacing / this.width() : 0;
        return padding;
    }

    private xScale = () => {
        const data = this.props.data;
        const padding = this.padding();
        return (

            d3.scaleBand<number>()
                .domain(d3.range(data.length))
                .range([0, this.width()])
                .padding(padding)
        )
    }

    private yScale = () => {
        const max = this.props.max;

        return (d3.scaleLinear()
            .domain([0, max])
            .range([0, this.height()])
        );
    }

    private renderXAxis = () => {
        const dates = ['Su', 'M', 'T', 'W', 'R', 'F', 'Sa'];
        const x = this.xScale();
        return dates.map((d, index) => {
            const xindex = x(index);
            return (
                <Text
                    x={xindex ? xindex + 25 + (x.bandwidth() / 2) : undefined}
                    y={this.height() + (17)}
                    fontSize={15}
                    fill={"black"}
                    textAnchor={"middle"}
                    fontFamily={"OpenSans-SemiBold"}
                >
                    {d}
                </Text>
            )
        })
    }

    private renderYAxis = () => {
        return (
            <Text
                x={25}
                y={50}
                fontSize={15}
                fill={"black"}
                textAnchor={"end"}
                fontFamily={"OpenSans-Semibold"}
            >
                {"100%"}
            </Text>
        )
    }
    private chartMargin = () => {
        return this.props.outerMargin ? this.props.outerMargin : 0;
    }
}


interface LineProps { 
    height: number;
    width: number;
    data: ([number, number])[]
    yMax?: number;
    yMin?: number;
    xMax?: number;
    xMin?: number;
    xAxisMargin: number;
    yAxisMargin: number;
    outerMargin?: number;
}


export class LineChart extends React.Component<LineProps> {

    render = () => {
        const {height, width, ...rest} = this.props;
        return (
            <Svg
                height={this.props.height}
                width={this.props.width}
                viewBox={[0, 0, this.props.width, this.props.height].join(' ')}
            >
                    <LineContent
                        xPos={this.props.yAxisMargin + this.chartMargin()}
                        yPos={0 + this.chartMargin()}
                        height={this.props.height - this.props.xAxisMargin - 2 * this.chartMargin()}
                        width={this.props.width - this.props.yAxisMargin - 2 * this.chartMargin()}
                        {...rest}
                    ></LineContent>
                <XAxis
                    x1={this.props.yAxisMargin + this.chartMargin()}
                    x2={this.props.width - this.chartMargin()}
                    y={this.props.height - this.props.xAxisMargin - this.chartMargin()}
                ></XAxis>
                <YAxis
                    y1={this.chartMargin()}
                    y2={this.props.height - this.props.xAxisMargin - this.chartMargin()}
                    x={this.props.yAxisMargin + this.chartMargin()}
                ></YAxis>

            </Svg>
        )
    }

    private chartMargin = () => {
        return this.props.outerMargin ? this.props.outerMargin : 0;
    }

}

export interface XAxisProps {
    x1: number;
    x2: number;
    y: number;
}

export class XAxis extends React.Component<XAxisProps> {

    render = () => {
        const {x1, x2, y} = this.props;
        return (
            <Line
                stroke={"black"}
                strokeWidth={1}
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
            ></Line>
        )
    }
}

export interface YAxisProps {
    y1: number;
    y2: number;
    x: number;
}

export class YAxis extends React.Component<YAxisProps> {

    render = () => {
        const {y1, y2, x} = this.props;

        return (
            <Line
                stroke={"black"}
                strokeWidth={1}
                x1={x}
                y1={y1}
                x2={x}
                y2={y2}
            ></Line>
        )
    }
}