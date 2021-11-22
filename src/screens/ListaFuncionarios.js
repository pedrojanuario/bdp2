import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { Text, withTheme, List, Avatar, FAB, ActivityIndicator } from 'react-native-paper'
import Header from '../components/Header'
import { BACKEND } from '../constants'
import Navigation from '../routes/Navigation'

function ListaFuncionarios({ navigation, theme }) {
    const { colors } = theme
    const [dados, setDados] = useState([])
    const [carregandoDados, setcarregandoDados] = useState([false])
    const [refreshing, setRefreshing] = useState(false)
    useEffect(() => {
        obterFuncionarios()
    }, [])

    async function obterFuncionarios() {
        setcarregandoDados(true)
        let url = `${BACKEND}/Funcionarios`
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setDados(data)
                console.log(data)
            })
            .catch(function (error) {
                console.error('Erro ao obter Dados !!!' + error.message)

            })

        setcarregandoDados(false)
    }

    return (
        <>
            <Header titulo="Dados" voltar={true} navigation={navigation} />
            <View>
                <List.Subheader>
                    <Avatar.Icon size={24} icon="refresh" /> Atualizar Dados
                </List.Subheader>
                {carregandoDados && <ActivityIndicator size="large" />}
                {dados.length === 0 && !carregandoDados ? (
                    <View>
                        <Text style={{ fontSize: 20 }}>Não ha dados</Text>
                    </View>
                )
                    : (
                        <FlatList
                            data={dados}
                            renderItem={({ item }) => (
                                <ListaFuncionario data={item} navigation={navigation} />
                            )}
                            keyExtractor={item => item._id.toString()}


                        />
                    )}
                <FAB
                    style={styles.fab}
                    icon='plus'
                    label=''
                    onPress={() => navigation.navigate('AdicionaFuncionario')}
                />

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 4,
        bottom: 8
    }
})
export default withTheme(ListaFuncionarios)