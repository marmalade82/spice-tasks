
import React from "react";

import {
    StreakCycleListItem,
    StreakCycle as IStreakCycle,
} from "src/Components/Lists/Items/StreakCycleListItem";

import StreakCycle from "src/Models/Group/StreakCycle";
import withObservables from "@nozbe/with-observables";

interface Props {
    cycle: StreakCycle,
    navigation: any,
}

const AdaptedStreakCycleListItem: React.FunctionComponent<Props> = function(props: Props) {
    const cycle = props.cycle;
    const mappedStreakCycle: IStreakCycle = {
        id: cycle.id,
        start: cycle.startDate,
        end: cycle.endDate,
    }

    return (
        <StreakCycleListItem
            item={mappedStreakCycle}
            accessibilityLabel={"streakcycle-list-item"}
            navigation={props.navigation}
        ></StreakCycleListItem>
    );
}

interface InputProps extends Props {

}

const enhance = withObservables(['cycle'], (props: InputProps) => {
    return {
        cycle: props.cycle.observe()
    }
})

export const ConnectedStreakCycleListItem = enhance(AdaptedStreakCycleListItem);