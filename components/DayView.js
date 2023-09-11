import React, { useState } from "react";
import { useEffect } from 'react';
import { View, SafeAreaView, FlatList, StyleSheet } from "react-native";
import FirestoreStorage from "../libraries/FirestoreStorage";
import { Text, Card, Button, Icon } from '@rneui/themed';

export default function DayView(props) {

    const [exercisePrimaryList, setExercisePrimaryList] = useState([])
    const [exerciseAccessoryList, setExerciseAccesoryList] = useState([])
    const [iterations, setIterations] = useState({})

    const getScheduleFromId = (id, schedules) => {
        return schedules.find(s => s.Id == id)
    }

    useEffect( () => {
        console.log('clientUserNameDay', props.route.params.clientUsername)
        async function fetchSchedulesAndIterations() {
            let schedules = await FirestoreStorage.getSchedules()
            let day = props.route.params.dayNumber
            let schedule = getScheduleFromId(props.route.params.client.scheduleId, schedules)
            let block = schedule.CurrentBlock
            let week = schedule.CurrentWeek
            setIterations({
                block: block,
                week: week
            })
            console.log(block)
            console.log(week)
            let exercises = schedule?.Blocks[block]?.Weeks[week]?.Days[day]?.Exercises
            let maxes = props.route.params.client.maxes
            let maxDict = {}

            maxes.forEach(max => {
                let normalizedName = max.name.toLowerCase().replaceAll(' ', '')
                maxDict[normalizedName] = max.weight
            });

            let exerciseList = []
            exercises?.forEach(exercise => {
                let exerciseName = normalizeName(exercise.Name)
                let listExercise = {}
                listExercise['name'] = exerciseName
                listExercise['rawName'] = exercise.Name
                listExercise['type'] = exercise.Type
                if (maxDict[exerciseName] != null) {
                    listExercise['weight'] = Math.round(exercise.Multiplier * maxDict[exerciseName])
                }
                else {
                    listExercise['weight'] = "no max"
                }
                listExercise['sets'] = exercise.Sets
                listExercise['reps'] = exercise.Reps
                exerciseList.push(listExercise)
            })
            const primaryExerciseList = exerciseList.filter(ex => ex.type == 1)
            const accessoryExerciseList = exerciseList.filter(ex => ex.type == 2)
            setExercisePrimaryList(primaryExerciseList)
            setExerciseAccesoryList(accessoryExerciseList)
            console.log('exes', primaryExerciseList)
        }
        fetchSchedulesAndIterations()
    }, [])

    const styles = StyleSheet.create({
        exerciseCardRow: {
          flexDirection: "row",
          justifyContent: "space-between"
        },
        iterations: {
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 10
        },
        sectionTitleView: {
            flexDirection: "row",
            justifyContent: "center"
        },
        sectionTitle: {
            fontWeight: "bold"
        }
      });

    const normalizeName = (name) => {
        return name.toLowerCase().replaceAll(' ', '')
    }

    const RenderedExercise = ({exercise}) => {
        return (
            <View>
                <Card>
                    <Card.Title>{exercise.rawName}</Card.Title>
                    <View style={styles.exerciseCardRow}>
                        <Text>Sets: {exercise.sets}</Text>
                        <Text>Reps: {exercise.reps}</Text>
                        <Text>{exercise.weight} kgs</Text>
                    </View>
                </Card>
            </View>
        );
    }

    const SectionTitle = ({text}) => {
        return(
            <View style={styles.sectionTitleView}>
                <Text style={styles.sectionTitle}>{text}</Text>
            </View>
        )
    }

    return(
        <SafeAreaView>
            <View style={styles.iterations}>
                <Text>Block: {iterations.Block}</Text>
                <Text>Week: {iterations.Week}</Text>
                <Text>Day: {props.route.params.dayNumber + 1}</Text>
            </View>
            <View>
                <FlatList
                    ListHeaderComponent={<SectionTitle text="Primary"/>}
                    data={exercisePrimaryList}
                    renderItem={({item}, index) => <RenderedExercise exercise={item}/>}
                    keyExtractor={item => item.id}
                />
                <FlatList
                    ListHeaderComponent={<SectionTitle text="Accessories"/>}
                    data={exerciseAccessoryList}
                    renderItem={({item}, index) => <RenderedExercise exercise={item}/>}
                    keyExtractor={item => item.id}
                />
            </View>
        </SafeAreaView>
    )
}