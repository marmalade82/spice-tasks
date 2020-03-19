
import React from "react";
import {
    Svg, Circle, Rect, G,
    Line, Text,
} from "react-native-svg";

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
