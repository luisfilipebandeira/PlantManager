import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    Alert
} from 'react-native'
import { Header } from '../Components/Header'
import colors from '../styles/colors'
import waterdrop from '../assets/waterdrop.png'
import { plantProps, loadPlant, removePlant } from '../libs/storage'
import { formatDistance } from 'date-fns'
import { pt } from 'date-fns/locale'
import fontes from '../styles/fontes'
import { PlantCardSecondary } from '../Components/PlantCardSecondary'
import { Load } from '../Components/Load'
import { useNavigation } from '@react-navigation/core'

export function MyPlants(){
    const [myPlants, setMyPlants] = useState<plantProps[]>([])
    const [loading, setLoading] = useState(true)
    const [nextWaterd, setNextWaterd] = useState<string>()

    const navigation = useNavigation()

    function handleRemove(plant: plantProps){
        Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
            {
                text: 'Não 🙏',
                style: 'cancel'
            },
            {
                text: 'Sim 🤧',
                onPress: async () => {
                    try{
                        await removePlant(plant.id)
                        setMyPlants((oldData) => 
                            oldData.filter((item) => item.id !== plant.id)
                        );
                        
                    }catch(error){
                        Alert.alert('Não foi possivel remover! 🤧')
                    }
                }
            }
        ])
    }

    function handlePlanctSelect(plant: plantProps){
        navigation.navigate('PlantSave', { plant })
    }

    useEffect(() => {
        async function loadStoragedData(){
            const plantsStoraged = await loadPlant()

            const nextTime = formatDistance(
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: pt }
            )

            setNextWaterd(`Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime} horas.`)

            setMyPlants(plantsStoraged)
            setLoading(false)
        }

        loadStoragedData()
    }, [])


    if(loading)
        return <Load />
    return(
        <View style={styles.container}>
            <Header />

            <View style={styles.spotlight}>
                <Image source={waterdrop} style={styles.spotlightImage} />
                <Text style={styles.spotlightText}>
                    {nextWaterd}
                </Text>
            </View>

            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Proximas regadas
                </Text>

                <FlatList 
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({item}) => (
                        <PlantCardSecondary data={item} onPress={() => handlePlanctSelect(item)} handleRemove={() => {handleRemove(item)}} />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spotlightImage: {
        width: 60,
        height: 60
    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fontes.heading,
        color: colors.heading,
        marginVertical: 20
    }
})