
import React from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import { AddRewardForm, AddRewardData, AddRewardDefault } from "src/Components/Forms/AddRewardForm";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { RewardQuery, Reward } from "src/Models/Reward/RewardQuery";
import { DocumentView, ScreenHeader } from "src/Components/Styled/Styled";
import SaveButton from "src/Components/Basic/SaveButton";

interface Props {
    navigation: any;
}

interface State { 
    data: AddRewardData;
    reward?: Reward;
}

const localStyle = StyleSheet.create({
    container: {
    }
});

export default class AddRewardScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            data: AddRewardDefault(),
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Reward',
        }
    }

    componentDidMount = async () => {
        const id = this.props.navigation.getParam('id', '');
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
    }

    onSave = () => {
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

        this.props.navigation.goBack();
    }

    render = () => {
        return (
            <DocumentView >
                <ScreenHeader>Add/Edit Reward</ScreenHeader>
                <ScrollView style={{
                }}>
                    { this.renderRewardForm() }
                </ScrollView>
                <SaveButton
                    onSave={this.onSave}
                ></SaveButton>
            </DocumentView>
        );
    }

    renderRewardForm = () => {
        return (
            <AddRewardForm
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