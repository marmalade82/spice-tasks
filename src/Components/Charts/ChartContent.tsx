
import React from "react";
import {
    Svg, Circle, Rect, G,
    Line, Text, Path
} from "react-native-svg";

import * as d3 from "d3";

interface BarProps {
    xPos: number;
    yPos: number;
    height: number;
    width: number;
    data: number[];
    max: number;
    barFill?: string;
    barStroke?: string;
    strokeWidth? : number;
    spacing?: number;
}


export class BarContent extends React.Component<BarProps> {

    render = () => {
        return (
            <G
                transform={`translate(${this.props.xPos},${this.props.yPos})`}
            >
                {this.renderBars()}
            </G>
        )
    }

    private height = () => {
        return this.props.height;
    }

    private width = () => {
        return this.props.width;
    }

    private renderBars = () => {
        const {data, max, barStroke, barFill, strokeWidth} = this.props;
        const x = this.xScale();
        const y = this.yScale();
        return (
            data.map((num, index) => {
                const val = Math.min(num, max);
                return (
                    <Rect
                        x={x(index)}
                        y={this.height() - y(val)}
                        width={x.bandwidth() }
                        height={y(val)}
                        strokeWidth={strokeWidth? strokeWidth: 0}
                        stroke={barStroke ? barStroke : "black"}
                        fill={barFill ? barFill : "white"}
                        key={index}
                    ></Rect>
                )
            })
        )
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

    private padding = () => {
        const padding = this.props.spacing ? this.props.spacing / this.width() : 0;
        return padding;
    }

    private yScale = () => {
        const max = this.props.max;

        return (d3.scaleLinear()
            .domain([0, max])
            .range([0, this.height()])
        );
    }
}

interface LineProps {
    xPos: number;
    yPos: number;
    height: number;
    width: number;
    data: ([number, number])[]
    yMax?: number;
    yMin?: number;
    xMax?: number;
    xMin?: number;
}

export class LineContent extends React.Component<LineProps> {

    render = () => {
        return (
            <G
                transform={`translate(${this.props.xPos},${this.props.yPos})`}
            >
                {this.renderLine()}
            </G>
        )
    }

    private height = () => {
        return this.props.height;
    }

    private width = () => {
        return this.props.width;
    }

    private xScale = () => {
        const { xMax, xMin } = this.props;
        const max = xMax ? xMax : d3.max(this.props.data, (datum) => datum[0])
        const min = xMin ? xMin : d3.min(this.props.data, (datum) => datum[0])

        return (d3.scaleLinear()
            .domain([min ? min : 0, max ? max : 1])
            .range([0, this.width()])
        );
    }

    private yScale = () => {
        const { yMax, yMin } = this.props;
        const max = yMax ? yMax : d3.max(this.props.data, (datum) => datum[1])
        const min = yMin ? yMin : d3.min(this.props.data, (datum) => datum[1])

        return (d3.scaleLinear()
            .domain([min ? min : 0, max ? max : 1])
            .range([0, this.height()])
        );
    }

    private renderLine = () => {
        const x = this.xScale();
        const y = this.yScale();
        const path: string[] = this.props.data.map((vals: [number, number]) => {
            const x1 = x(vals[0]);
            const y1 = y(vals[1]) * -1 + this.height();
            return (
                `${x1},${y1}`
            )
        });

        const pathStr = !path.length ? "" : `M ${path[0]} L ${path.join(" ")}`

        return (
            <Path
                fill="none"
                stroke="black"
                strokeWidth={1}
                d={pathStr}
            >

            </Path>
        )
    }
}