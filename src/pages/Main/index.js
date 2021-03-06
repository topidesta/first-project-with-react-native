import React, { Component } from 'react';
// Validações das propriedades
import PropTypes from 'prop-types';
// Keyboard é o teclado e ActivityIndicator é o sinal de loading
import { Keyboard, ActivityIndicator } from 'react-native';
// Para salvar os dados no device
import AsyncStorage from '@react-native-community/async-storage';
// importando ícone/informando o nome do pacote que queremos utilizar
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';

export default class Main extends Component {
  // TEST
  // static navigationOptions = {
  //   title: 'Usuários',
  // };

  /* PropTypes exporta uma variedade de validadores que podem ser usados para certificar que os dados que você recebe são válidos e só para as propriedades
  que estão em uso no componente */
  static propTypes = {
    /* PropTypes.shape pode ser usado quando uma validação mais detalhada de um objeto prop é necessária. Ele garante que o suporte seja um objeto que contenha um conjunto de chaves especificadas com valores dos tipos especificados. */
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    // armazenando o valor do input
    newUser: '',
    // os usuários
    users: [],
    // Carregado
    loading: false,
  };

  // buscando os dados no banco
  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      // carregando do AsyncStorage para users convertendo para JSON
      this.setState({ users: JSON.parse(users) });
    }
  }

  // se tiver alterações em users pegando state antes dele receber a atualização
  componentDidUpdate(_, prevState) {
    const { users } = this.state;

    if (prevState.users !== users) {
      // salvando os dados no AsyncStorage convertendo para string
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  // lidando com a adição de usuário
  handleAddUser = async () => {
    const { users, newUser } = this.state;

    /**
     * setState() agenda uma atualização para o objeto state de um componente.
     * Quando o state muda, o componente responde renderizando novamente.
     * carregado
     */
    this.setState({ loading: true });

    // buscando o usuário do github
    const response = await api.get(`/users/${newUser}`);

    // pegando alguns dados do usuário
    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    this.setState({
      // incluindo o usuário no array de usuários
      users: [...users, data],
      // setando o input como vazio
      newUser: '',
      // carregado
      loading: false,
    });

    // para tirar o teclado depois do send
    Keyboard.dismiss();
  };

  // método para lincar as páginas recebendo o usuário como parâmetro
  handleNavigate = user => {
    // pegando a função navigate
    const { navigation } = this.props;

    /**
     * indicando a tela/rota, contendo todos os parâmetros que são recebidos
     * nessa rota, então ela precisa receber essa propriedades que estão sendo
     * validadas no PropTypes
     */
    navigation.navigate('User', { user });
  };

  render() {
    // buscando os dados no state
    const { users, newUser, loading } = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar usuário"
            value={newUser}
            /* recebendo o texto do input */
            onChangeText={text => this.setState({ newUser: text })}
            /* usando o teclado para enviar */
            returnKeyType="send"
            /* mostrar qual método vai ser usado quando send */
            onSubmitEditing={this.handleAddUser}
          />
          {/* recebendo o loading e ouvindo o click do botão */}
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {/* usando um if ternário, se loading ActivityInd... senão Icon */}
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Icon name="add" size={20} color="#FFF" />
            )}
          </SubmitButton>
        </Form>

        {/* criando a listagem de usuários */}
        <List
          // onde estão os dados da minha lista
          data={users}
          /* Usado para extrair uma chave exclusiva para um determinado item no índice especificado. A chave é usada para armazenar em cache e como chave de reação para rastrear o pedido novamente de itens. */
          keyExtractor={user => user.login}
          // cada dado dentro de const data
          renderItem={({ item }) => (
            <User>
              {/* passando um objeto dentro de um código js */}
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              {/* ouvindo o click do botão para direcionar para a outra página com os dados do usuário */}
              <ProfileButton onPress={() => this.handleNavigate(item)}>
                <ProfileButtonText>Ver perfil</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
