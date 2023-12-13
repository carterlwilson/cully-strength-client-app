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
        console.log('id', id)
        console.log('schedules', schedules)
        return schedules.find(s => s.Id == id)
    }

    useEffect( () => {
        async function fetchSchedulesAndIterations() {
            let schedules = await FirestoreStorage.getSchedules()
            let day = props.route.params.dayNumber
            let schedule = getScheduleFromId(props.route.params.client.scheduleId, schedules)
            let block = schedule.CurrentBlock
            let week = schedule.CurrentWeek
            console.log('client', props.route.params.client)
            setIterations({
                block: block,
                week: week
            })
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
                let maxName = normalizeName(exercise.MaxReference)
                let listExercise = {}
                listExercise['name'] = exerciseName
                listExercise['rawName'] = exercise.Name
                listExercise['type'] = exercise.Type
                if (maxDict[maxName] != null) {
                    listExercise['weight'] = Math.round(exercise.Multiplier * maxDict[maxName])
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

            console.log("id", accessoryExerciseList[0])
            setExercisePrimaryList(primaryExerciseList)
            setExerciseAccesoryList(accessoryExerciseList)
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
                <Text>Block: {iterations.block + 1}</Text>
                <Text>Week: {iterations.week + 1}</Text>
                <Text>Day: {props.route.params.dayNumber + 1}</Text>
            </View>
            <View>
                <FlatList
                    ListHeaderComponent={<SectionTitle text="Primary"/>}
                    data={exercisePrimaryList}
                    renderItem={({item}, index) => <RenderedExercise exercise={item}/>}
                    keyExtractor={item => {return item.name}}
                />
                <FlatList
                    ListHeaderComponent={<SectionTitle text="Accessories"/>}
                    data={exerciseAccessoryList}
                    renderItem={({item}, index) => <RenderedExercise exercise={item}/>}
                    keyExtractor={item => {return item.name}}
                />
            </View>
        </SafeAreaView>
    )
}