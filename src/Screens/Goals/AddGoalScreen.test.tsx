
import React from "react";
import { fireEvent, render, wait } from '@testing-library/react-native';
import AddGoalScreen from "src/Screens/Goals/AddGoalScreen";
import { navigation } from "src/common/test-utils";



test('User can set type of goal to streak if desired', async () => {
    const { getByText } = render(<AddGoalScreen navigation={navigation}></AddGoalScreen>)
    const typeNode = getByText("Type");
    fireEvent.change(typeNode, { nativeEvent: { text: "streak" } });
    const minimumNode = getByText("Minimum");
});