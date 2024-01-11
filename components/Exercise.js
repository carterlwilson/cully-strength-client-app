import React from "react"
import {View, Text, StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    exerciseText: {
      fontSize: 50
    }
});

const ExerciseView = (props) => {
    return (
        <View>
            <Text>Name: {props.ExerciseName}</Text>
            <Text style={styles.exerciseText}>Sets: {props.Sets}</Text>
            <Text>Reps: {props.Reps}</Text>
            <Text>Weight: {props.Weight * props.Multiiplier}</Text>
        </View>
    )
}

export default ExerciseView;