import React from 'react';
import { View } from 'react-native';
import { Button, Title, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../route-types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export default function Home() {
    const navigation = useNavigation<Navigation>();

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content style={styles.content}>
                    <Title style={styles.title}>Menu Principal</Title>

                    <View style={styles.buttonContainer}>
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate('RestaurantRegistration')}
                            style={styles.button}
                            buttonColor="#d32f2f"
                            icon="store"
                        >
                            Cadastro de Restaurante
                        </Button>

                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate('ProductRegistration')}
                            style={styles.button}
                            buttonColor="#d32f2f"
                            icon="food"
                        >
                            Cadastro de Produto
                        </Button>

                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate('MenuList')}
                            style={styles.button}
                            buttonColor="#d32f2f"
                            icon="menu"
                        >
                            Lista de Cardápio
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
}