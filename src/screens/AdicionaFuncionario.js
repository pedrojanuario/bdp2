import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { withTheme, Caption, TextInput, FAB, HelperText, Checkbox, Snackbar } from 'react-native-paper'
import Header from '../components/Header'
import { BACKEND } from '../constants'

function AdicionaFuncionario({ navigation, theme }) {
    const [nome, setNome] = useState('')
    const [status, setStatus] = useState(true)
    const [statusd, setStatusd] = useState(false)
    const [erros, setErros] = useState({})
    const [aviso, setAviso] = useState('')
    const [salvandoFuncionario, setsalvandoFuncionario] = useState(false)

    const { colors } = theme

    const validaErrosFuncionario = () => {
        const novosErros = {}
        if (!nome || nome === '') novosErros.nome = 'O campo nome não pode estar vazio !'
        return novosErros
    }

    async function salvaFuncionario() {
        const novosErros = validaErrosFuncionario()
        if (Object.keys(novosErros).length > 0) {
            setErros(novosErros)
        } else {
            setErros({})
            let statusFuncionario = (status === true || status === 'proprio') ? 'proprio' : 'terceirizado'
            let funcionariostatus = { nome: nome, status: statusFuncionario }
            setsalvandoFuncionario(true)

            let url = `${BACKEND}/funcionarios`
            await fetch(url, {
                mode: 'cors',
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(funcionariostatus)
            }).then(response => response.json())
                .then(data => {
                    (data.message || data._id) ? setAviso('Funcionario adicionado com sucesso!') : setAviso('')
                    setNome('')
                    setStatus(true)
                })
                .catch(function (error) {
                    setAviso('Não foi possível salvar o funcionario ' + error.message)
                })
        }
        setsalvandoFuncionario(false)
    }

    return (


        <View style={{ flex: 3, backgroundColor: colors.surface }}>
            <Header titulo="Cadastro de Funcionarios"
                voltar={true} navigation={navigation} />
            <Caption> </Caption>
            <TextInput
                label="Nome do funcionario"
                mode="outlined"
                name="nome"
                value={nome}
                onChange={setNome}
                error={!!erros.nome}
            />
            <TextInput
                label=" Idade"
                mode="outlined"
                name="idade"
                keyboardType='numeric'
            />
            <TextInput
                label="Cargo"
                mode="outlined"
                name="cargo"
            />
            <TextInput
                label="Salario"
                mode="outlined"
                name="salario"
                keyboardType='numeric'
            />
            <HelperText tpye="error" visible={!!erros.nome}>
                {erros.nome}
            </HelperText>

            <View style={styles.checkbox}>
                <Checkbox status={status ? 'checked' : 'unchecked'}
                    onPress={() => setStatus(!status)}
                />
                <Text style={{ color: colors.Text, marginTop: 8 }}>Proprio</Text>
            </View>
            <View style={styles.checkbox}>
                <Checkbox status={statusd ? 'checked' : 'unchecked'}
                    onPress={() => setStatusd(!statusd)}
                />
                <Text style={{ color: colors.Text, marginTop: 8 }}>Terceirizado</Text>
            </View>
            <FAB style={styles.fab}
                icon='content-save'
                loading={salvandoFuncionario}
                disabled={erros.length > 0}
                onPress={() => salvaFuncionario()}
            />
            <Snackbar

                visible={aviso.length > 0}
                onDismiss={() => setAviso('')}
                action={{
                    label: 'Voltar',
                    onPress: () => navigation.goBack()
                }}>
                <Text>{aviso}</Text>
            </Snackbar>

        </View>



    )
}

const styles = StyleSheet.create({
    checkbox: {
        flexDirection: 'row'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 4,
        bottom: 8
    }
})

export default withTheme(AdicionaFuncionario)