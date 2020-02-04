
import React from "react";
import { fireEvent, render, wait } from '@testing-library/react-native';
import ListItem from "src/Components/Styled/ListItem";
import { makeNavigation } from "src/common/test-utils";


test('Sanity check: test succeeds in running', async () => {
    const { getByText } = render(
        <ListItem 
            navigation={makeNavigation({})}
            params={{}}
            destination="Nowhere"
            text={"Hello"}
            subtext={"Goodbye"}
            number={5}
            key={"1"}
        >

        </ListItem>
    );

});