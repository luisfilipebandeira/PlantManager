import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native'

import userImg from '../assets/luis.jpg'
import colors from '../styles/colors'
import fontes from '../styles/fontes'

export function Header(){
    return(
        <View style={styles.container}>
            <View>
                <Text style={styles.greeting}>Olá,</Text>
                <Text style={styles.userName}>Luis</Text>
            </View>

            <Image source={userImg} style={styles.image} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: 15
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 40
    },
    greeting: {
        fontSize: 32,
        color: colors.heading,
        fontFamily: fontes.text
    },
    userName: {
        fontSize: 32,
        fontFamily: fontes.heading,
        color: colors.heading,
        lineHeight: 40
    }
})