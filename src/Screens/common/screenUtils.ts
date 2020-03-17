import { Navigation, FullNavigation } from "src/common/Navigator";


export function getKey(navigation: FullNavigation) {
    return navigation.state.key;
}
