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
            let schedule = await FirestoreStorage.getSchedule(props.route.params.client.scheduleId)
            let day = props.route.params.dayNumber
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
            margin: 10,
        },
        sectionTitleView: {
            flexDirection: "row",
            justifyContent: "center"
        },
        sectionTitle: {
            fontWeight: "bold",
            fontSize: 25
        },
        exerciseText: {
            fontSize: 20
        },
        exerciseCardTitle: {
            fontSize: 22
        },
        iterationsText: {
            fontSize: 20
        }
      });

    const normalizeName = (name) => {
        return name.toLowerCase().replaceAll(' ', '')
    }

    const RenderedExercise = ({exercise}) => {
        return (
            <View>
                <Card>
                    <Card.Title style={styles.exerciseCardTitle}>{exercise.rawName}</Card.Title>
                    <View style={styles.exerciseCardRow}>
                        <Text style={styles.exerciseText}>Sets: {exercise.sets}</Text>
                        <Text style={styles.exerciseText}>Reps: {exercise.reps}</Text>
                        <Text style={styles.exerciseText}>{exercise.weight} kgs</Text>
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
                <Text style={styles.iterationsText}>Block: {iterations.block + 1}</Text>
                <Text style={styles.iterationsText}>Week: {iterations.week + 1}</Text>
                <Text style={styles.iterationsText}>Day: {props.route.params.dayNumber + 1}</Text>
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