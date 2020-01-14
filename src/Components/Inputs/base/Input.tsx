import React from "react";

interface InputProps {
    accessibilityLabel: string;
}

export default class Input<Props, State> extends React.Component<Props & InputProps, State> {
    constructor(props: Props & InputProps) {
        super(props);
    }
}