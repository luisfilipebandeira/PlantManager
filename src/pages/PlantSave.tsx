import { useNavigation, useRoute } from '@react-navigation/core'
import React, { useState } from 'react'
import {
    StyleSheet,
    Alert,
    Text,
    View,
    Image,
    ScrollView,
    Platform,
    TouchableOpacity
} from 'react-native'
import {SvgFromUri} from 'react-native-svg'
import DateTimePicker,{ Event } from '@react-native-community/datetimepicker'

import waterdrop from '../assets/waterdrop.png'
import { Button } from '../Components/Button'
import colors from '../styles/colors'
import fontes from '../styles/fontes'
import { format, isBefore } from 'date-fns'
import { plantProps, savePlant } from '../libs/storage'

interface Params{
    plant: plantProps
}

export function PlantSave(){
    const [selectedDateTime, setSelectedDateTime] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS == 'ios')

    const navigation = useNavigation()

    const route = useRoute()
    const { plant } = route.params as Params


    function handleChangeTime(event: Event, dateTime: Date | undefined){
        if(Platform.OS === 'android'){
            setShowDatePicker((oldState => !oldState))
        }

        if(dateTime && isBefore(dateTime, new Date)){
            setSelectedDateTime(new Date())
            return Alert.alert('Você não pode escolher um horário que já passou!')
        }

        if(dateTime)
            setSelectedDateTime(dateTime)
    }

    function handleOpenDateTimePickerForAndroid(){
        setShowDatePicker(oldSate => !oldSate)
    }

    async function handleSave(){
        try{
            await savePlant({
                ...plant,
                dateTimeNotification: selectedDateTime
            })

            navigation.navigate("Confirmation",{
                title: 'Tudo certo',
                subtitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado.',
                buttonTitle: 'Muito Obrigado :D',
                icon: 'hug',
                nextScreen: 'MyPlants'
            })
        }catch{
            Alert.alert('Não foi possivel salvar esse horário!')
        }
    }

    return(
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <View style={styles.container}>
                <View style={styles.plantInfo}>
                    <SvgFromUri uri={plant.photo} height={150} width={150} />

                    <Text style={styles.plantName}>
                        {plant.name}
                    </Text>
                    <Text style={styles.plantAbout}>
                    {plant.about}
                    </Text>
                </View>

                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        <Image source={waterdrop} style={styles.tipImage} />

                        <Text style={styles.tipText}>
                            {plant.water_tips}
                        </Text>
                    </View>

                    <Text style={styles.alertLabel}>
                        Escolha o melhor horário para ser lembrado
                    </Text>

                    {
                        showDatePicker && (
                        <DateTimePicker
                        value={selectedDateTime} 
                        mode='time'
                        display="spinner"
                        onChange={handleChangeTime}
                    />)}

                    {Platform.OS === 'android' &&(
                        <TouchableOpacity style={styles.dateTimePickerButton} onPress={handleOpenDateTimePickerForAndroid}>
                            <Text style={styles.dataTimePickerText}>
                                {`Alterar ${format(selectedDateTime, 'HH:mm')}`}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <Button title="Cadastrar planta" onPress={handleSave}/>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape
    },
    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.shape
    },
    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20
    },
    plantName: {
        fontFamily: fontes.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15
    },
    plantAbout: {
        textAlign: 'center',
        fontFamily: fontes.text,
        color: colors.heading,
        marginTop: 10
    },
    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 60
    },
    tipImage: {
        width: 56,
        height: 56
    },
    tipText: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fontes.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: 'center'
    },
    alertLabel: {
        textAlign: 'center',
        fontFamily: fontes.complement,
        color: colors.heading,
        fontSize: 12,
        marginBottom: 5
    },
    dataTimePickerText: {
        color: colors.green,
        fontSize: 24,
        fontFamily: fontes.text
    },
    dateTimePickerButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40
    }
})