import React from "react"
import {View, Text} from 'react-native'

export default function ExerciseView(props) {
    return (
        <View>
            <Text>Name: {props.ExerciseName}</Text>
            <Text>Sets: {props.Sets}</Text>
            <Text>Reps: {props.Reps}</Text>
            <Text>Weight: {props.Weight * props.Multiiplier}</Text>
        </View>
    )
}