import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    ActivityIndicator
} from 'react-native'
import colors from '../styles/colors'

import {Header} from '../Components/Header'
import {EnviromentButton} from '../Components/EnviromentButton'
import {PlantCardPrimary} from '../Components/PlantCardPrimary'
import {Load} from '../Components/Load'

import fontes from '../styles/fontes'
import api from '../services/api'
import { useNavigation } from '@react-navigation/core'
import { plantProps } from '../libs/storage'

interface EnviromentProps{
    key: string,
    title: string
}

export function PlantSelect(){
    const [enviroment, setEnviroment] = useState<EnviromentProps[]>([])
    const [plants, setPlants] = useState<plantProps[]>([])
    const [filteredPlants, setFilteredPlants] = useState<plantProps[]>([])
    const [enviromentSeleted, setEnviromentSeleted] = useState('all')
    const [loading, setLoading] = useState(true)

    const [page, setPage] = useState(1)
    const [loadingMore, setLoadingMore] = useState(false)

    const navigation = useNavigation()

    function handleEnviromentSelected(environment: string){
        setEnviromentSeleted(environment);
        
        if(environment == 'all'){
            return setFilteredPlants(plants)
        }
        
        const filtered = plants.filter(plant =>
            plant.environments.includes(environment)
        )

        setFilteredPlants(filtered)
    }

    async function fetchPlants(){
        const {data} = await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

        if(!data)
            return setLoading(true);

        if(page > 1){
            setPlants(oldValue => [...oldValue, ...data])
            setFilteredPlants(oldValue => [...oldValue, ...data])
        }else {
            setPlants(data)
            setFilteredPlants(data)
        }
        setLoading(false)
        setLoadingMore(false)
    }

    function handleFecthMore(distance: number){
        if(distance < 1)
            return;
        
        setLoadingMore(true)
        setPage(oldValue => oldValue + 1)
        fetchPlants()
    }
    
    function handlePlanctSelect(plant: plantProps){
        navigation.navigate('PlantSave', { plant })
    }

    useEffect(() =>{
        async function fetchEnviroment(){
            const {data} = await api.get('plants_environments?_sort=title&_order=asc');
            setEnviroment([
                {
                    key: 'all',
                    title: 'Todos'
                },
                ...data
            ])
        }

        fetchEnviroment()
    }, [])

    useEffect(() =>{
        fetchPlants()
    }, [])

    if(loading)
        return <Load />

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />

                <Text style={styles.title}>Em qual ambiente</Text>
                <Text style={styles.subtitle}>Você quer colocar sua planta?</Text>
            </View>

            <View>
                <FlatList 
                    data={enviroment}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({item}) => (
                        <EnviromentButton 
                            title={item.title}
                            active={item.key === enviromentSeleted}
                            onPress={() => handleEnviromentSelected(item.key)}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
            </View>

            <View style={styles.plant}>
                <FlatList 
                    data={filteredPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({item}) => (
                        <PlantCardPrimary
                            data={item}
                            onPress={() => handlePlanctSelect(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.1}
                    onEndReached={({distanceFromEnd}) =>
                        handleFecthMore(distanceFromEnd)
                    }
                    ListFooterComponent={
                        loadingMore ?
                        <ActivityIndicator color={colors.green} />
                        : <></>
                    }
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        paddingHorizontal: 30  
    },
    title:{
        fontSize: 17,
        color: colors.heading,
        fontFamily: fontes.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fontes.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading
    },
    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32,
    },
    plant: {
        flex:1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    }
})