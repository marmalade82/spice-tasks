
import React from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import { AddRewardForm, AddRewardData, AddRewardDefault } from "src/Components/Forms/AddRewardForm";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { RewardQuery, Reward } from "src/Models/Reward/RewardQuery";

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
            (new RewardQuery().update(this.state.reward, rewardData)).catch();        
        } else {
            new RewardQuery().create(rewardData).catch();
        }
    }

    render = () => {
        return (
            <View style={[Style.container, localStyle.container]}>
                { this.renderRewardForm() }

                <Button
                    title={"SAVE"}
                    onPress={this.onSave}
                />
            </View>
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