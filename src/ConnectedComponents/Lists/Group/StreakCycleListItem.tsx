
import React from "react";

import {
    StreakCycleListItem,
    StreakCycle as IStreakCycle,
} from "src/Components/Lists/Items/StreakCycleListItem";

import StreakCycle from "src/Models/Group/StreakCycle";
import withObservables from "@nozbe/with-observables";
import { Navigation, ScreenParams } from "src/common/Navigator";
import { ChildTaskQuery } from "src/Models/Task/TaskQuery";

interface Props {
    cycle: StreakCycle,
    activeTaskCount: number,
    navigation: Navigation<ScreenParams>,
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
            completed={props.activeTaskCount === 0}
        ></StreakCycleListItem>
    );
}

interface InputProps extends Omit<Props, "activeTaskCount"> {

}

const enhance = withObservables(['cycle'], (props: InputProps) => {
    return {
        cycle: props.cycle.observe(),
        activeTaskCount: new ChildTaskQuery(props.cycle.id).queryActive().observeCount(),
    }
})

export const ConnectedStreakCycleListItem = enhance(AdaptedStreakCycleListItem);