
import ColumnReverseView from "src/Components/Basic/ColumnReverseView";
import React from "react";
import { fireEvent, render, wait } from '@testing-library/react-native';


test('Sanity check: no text should be within', async () => {
    const { getByText } = render(<ColumnReverseView style={{}}></ColumnReverseView>);

    expect(() => { getByText("hi") }).toThrow();
});