import React from 'react';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';

// Tudo o que criamos deixamos depois do Reactotron
import './config/ReactotronConfig';
// Importamos o roteamento com as páginas
import Routes from './routes';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <Routes />
    </>
  );
}
