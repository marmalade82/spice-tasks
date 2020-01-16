
function makeNavigation(params: {}) {
    const navigation = {
        navigate: jest.fn(),
        getParam: jest.fn((param: string, fallback: any) => {
            if(params[param] !== undefined) {
                return params[param];
            } else {
                return fallback;
            }
        }),
        goBack: jest.fn(),
    }
    return navigation;
}

export {
    makeNavigation
}
