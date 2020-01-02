
import { 
    Controller,
} from "../../../controllers/Controller";

interface Data {

}

class GoalItemController<Data> extends Controller<Data> {
    constructor(d: Data) {
        super(d);
    }

    start() {

    }

}




export {
    Data,
    GoalItemController
}