
import React from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import { AddRewardForm, AddRewardData, AddRewardDefault, ValidateRewardForm } from "src/Components/Forms/AddRewardForm";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { RewardQuery, Reward } from "src/Models/Reward/RewardQuery";
import { DocumentView, ScreenHeader, Toast } from "src/Components/Styled/Styled";
import { HeaderSaveButton } from "src/Components/Basic/HeaderButtons";
import { EventDispatcher } from "src/common/EventDispatcher";
import { getKey } from "../common/screenUtils";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";

interface Props {
    navigation: object;
}

interface State { 
    data: AddRewardData;
    reward?: Reward;
    toast: string;
    showToast: boolean;
}


const dispatcher = new EventDispatcher();

export default class AddRewardScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Reward',
            right: [
                () => {
                    return (
                        <HeaderSaveButton
                            dispatcher={dispatcher}
                            eventName={getKey(navigation)}
                        ></HeaderSaveButton>
                    )
                }
            ]
        }
    }

    navigation: MainNavigator<"AddReward">;
    rewardFormRef: React.RefObject<AddRewardForm>
    constructor(props: Props) {
        super(props);
        this.state = {
            data: AddRewardDefault(),
            toast: "",
            showToast: false,
        }
        this.rewardFormRef = React.createRef();
        this.navigation = new ScreenNavigation(props);
    }

    componentDidMount = async () => {
        const id = this.navigation.getParam('id', '');
        const reward = await new RewardQuery().get(id); 
        if(reward) {
            let data: AddRewardData = {
                name: reward.title,
                expire_date: reward.expireDate,
                details: reward.details,
            }
            this.setState({
                reward: reward,
                data: data,
            })
        } else {
            this.setState({
                reward: undefined
            })
        }
        dispatcher.addEventListener(getKey(this.navigation), this.onSave);
    }

    componentWillUnmount = () => {
        dispatcher.removeEventListener(getKey(this.navigation), this.onSave);
    }

    onSave = () => {
        let message : string | undefined = undefined;
        if(this.rewardFormRef.current) {
            message = ValidateRewardForm(this.rewardFormRef.current);
        }

        if(message !== undefined) {
            this.setState({
                showToast: true,
                toast: message,
            })
        } else {
            const data = this.state.data;
            const rewardData = {
                title: data.name,
                expireDate: data.expire_date,
                details: data.details,
            };

            debugger;
            if(this.state.reward) {
                void (new RewardQuery().update(this.state.reward, rewardData)).catch();        
            } else {
                void new RewardQuery().create(rewardData).catch();
            }

            this.navigation.goBack();
        }

    }

    render = () => {
        return (
            <DocumentView >
                <ScrollView style={{
                }}>
                    { this.renderRewardForm() }
                </ScrollView>
                <Toast
                    visible={this.state.showToast}
                    message={this.state.toast}
                    onToastDisplay={() => {
                        this.setState({
                            showToast: false,
                        })
                    }}
                ></Toast>
            </DocumentView>
        );
    }

    renderRewardForm = () => {
        return (
            <AddRewardForm
                ref={this.rewardFormRef}
                data={this.state.data}
                onDataChange={(d: AddRewardData) => {
                    this.setState({
                        data: d
                    });
                }}
                style={{}}
            ></AddRewardForm>
        );
    }
}