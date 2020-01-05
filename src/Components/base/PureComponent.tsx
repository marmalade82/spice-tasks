

import React from "react";

/*
This class represents a class that gets all its configurable features from its parent.
It cannot manage state, so a PureComponent must be wrapped to be involved with state.
*/
export default abstract class PureComponent<Props> extends React.Component<Props, {}> {

}