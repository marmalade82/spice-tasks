import React from "react";
import { Text, View } from 'react-native';
import Rewards from "src/Rewards";
import Style from "src/Style/Style";


export default function Home() {
  return (
    <View style={[Style.container, Style.yellowBg]}>
      <Text style={[Style.container, Style.redBg]}>Open UP App.tsx to start working on your APP!</Text>
      <View style={[Style.container, Style.blueBg]}>
        <Rewards style={[Style.greenBg]}></Rewards>
      </View>
    </View>
  );
}