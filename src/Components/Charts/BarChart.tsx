
import React from "react";
import {
    Svg, Circle, Rect, G,
    Line, Text, Path
} from "react-native-svg";

import { View, Text as T} from "react-native";

import * as d3 from "d3";


interface Props {
    height: number;
    width: number;
    data: number[];
    max: number;
    barFill?: string;
    barStroke?: string;
    strokeWidth? : number;
    spacing?: number;
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
                <Line
                    x1={0 + 25}
                    x2={propsWidth}
                    y1={propsHeight - 25}
                    y2={propsHeight - 25}
                    stroke={"black"}
                    strokeWidth={1}
                ></Line>
                {this.renderXAxis()}
                <Line
                    x1={25}
                    x2={25}
                    y1={0}
                    y2={propsHeight - 25}
                    stroke={"black"}
                    strokeWidth={1}
                ></Line>
                {this.renderYAxis()}
                <G
                    x={25}
                >
                    <Svg
                        height={this.height()}
                        width={this.width()}
                        viewBox={[0, 0, this.width(), this.height()].join(" ")}
                    >
                        {this.renderBars()}
                    </Svg>
                </G>
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
}

export default BarChart;


interface LineProps { 
    height: number;
    width: number;
    yData: number[];
    xData: number[];
    max: number;
}


export class LineChart extends React.Component<LineProps> {


    render = () => {
        return (
            <View
            >
                <Svg
                    height={this.props.height}
                    width={this.props.width}
                    viewBox={[0, 0, this.props.width, this.props.height].join(" ")}
                >
                {this.renderLine()}
                </Svg>
                <T>
                    {this.substrings(this.props.xData, 2).join("/").toString()}
                </T>
            </View>
        )
    }

    private height = () => {
        return this.props.height;
    }

    private width = () => {
        return this.props.width;
    }

    private xScale = () => {
        const max = d3.max(this.props.xData)

        return (d3.scaleLinear()
            .domain([0, max ? max : 1])
            .range([0, this.width()])
        );
    }

    private yScale = () => {
        const max = this.props.max;

        return (d3.scaleLinear()
            .domain([0, max])
            .range([0, this.height()])
        );
    }

    private renderLine = () => {
        const { yData: data } = this.props
        const x = this.xScale();
        const y = this.yScale();
        const path: string = this.props.xData.map((vals: number) => {
            const x1 = x(vals);
            return (
                `${x1},${Math.random() * 100}`
            )
        }).join(" ");

        return (
            <Path
                fill="none"
                stroke="black"
                strokeWidth={2}
                d={"M 0,50  L " + path}
            >

            </Path>
        )
    }

    /**
     * Creates an array of all n-length substrings of the arr @arr , in the order
     * that they occur in @arr
     */
    private substrings = (arr: number[], n: number) => {
        const result: number[][] = []
        
        for(let i = 0, total = arr.length; i + n <= total; i++) {
            const inner: number[] = [];
            for(let j = i, max = Math.min(j + n, total); j < max; j++) {
                inner.push(arr[j]);
            }
            result.push(inner);
        }

        return result;
    }
}