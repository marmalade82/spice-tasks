import { 
    Controller,
    ChildRegistrar,
    Child,
} from "../../../controllers/Controller";


import {
    GoalItemController,
    Data as GoalItemData
} from "./GoalItemController";

interface Data {
    title: string;
}

class GoalListController<Data> extends Controller<Data> {
    getGoalItem?: () => GoalItemData

    constructor(d: Data) {
        super(d);
    }

    start() {
        // Doesn't need to do anything special on start.
    }

    registerItem: ChildRegistrar<GoalItemData> = (c: Child<GoalItemData>) => {
        this.getGoalItem = () => {
            return c.getData()
        }

        return () => {
            this.getGoalItem = undefined;
        }
    }
}

export {
    Data,
    GoalListController
}