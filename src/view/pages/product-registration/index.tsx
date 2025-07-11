import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { TextInput, Button, HelperText, Card, Title, Appbar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './styles';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { LoadingOverlay } from '../../components/loading-overlay';
import { Product } from '../../../model/products';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../route-types';
import { getCurrentUser } from '../../../utils/auth';
import { addProduct } from '../../../controller/product-controller';
import { showError } from '../../../utils/error-handler';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Informe o nome'),
  description: Yup.string().required('Informe a descrição'),
  price: Yup.number().typeError('Informe um preço válido').required('Informe o preço'),
});

export default function ProductRegistration() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    navigation.replace('Login');
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Appbar.Action icon="logout" onPress={handleLogout} color="black" />
      ),

    });
  }, [navigation]);


  useEffect(() => {
    getCurrentUser().then(user => {
      if (!user || user.userType !== 'Admin') {
        showError('Acesso negado', 'Apenas administradores podem acessar esta tela.')
        navigation.goBack();
      } else {
        setIsAdmin(true);
      }
    });
  }, []);

  const escolherImagem = async () => {
    if (!isAdmin) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showError('Permissão necessária', 'Permita acesso às imagens para continuar.')
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveProduct = async (productData: Product) => {
    try {
      await addProduct(productData);
      navigation.navigate('ProductSuccess', { type: 'product' });
    } catch (error) {
      console.error('Erro ao salvar o produto:', error);
      showError('Erro', 'Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = (values: any) => {
    if (!imageUri) {
      showError('Erro', 'Selecione uma imagem para o produto.')
      return;
    }

    setLoading(true);

    const newProduct: Product = {
      id: Date.now().toString(),
      name: values.name,
      description: values.description,
      price: Number(values.price),
      imageUri: imageUri,
    };

    saveProduct(newProduct);
  };

  if (!isAdmin) return null;

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <Title style={styles.title}>Cadastro de Produto</Title>

            <Formik
              initialValues={{ name: '', description: '', price: '' }}
              validationSchema={validationSchema}
              onSubmit={handleCadastro}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty }) => (
                <>
                  <View style={styles.inputContainer}>
                    <TextInput
                      label="Nome do prato"
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      mode="outlined"
                      error={touched.name && !!errors.name}
                    />
                    <HelperText type="error" visible={touched.name && !!errors.name}>
                      {errors.name}
                    </HelperText>
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      label="Descrição"
                      value={values.description}
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      mode="outlined"
                      multiline
                      numberOfLines={4}
                      error={touched.description && !!errors.description}
                    />
                    <HelperText type="error" visible={touched.description && !!errors.description}>
                      {errors.description}
                    </HelperText>
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      label="Preço"
                      value={values.price}
                      onChangeText={handleChange('price')}
                      onBlur={handleBlur('price')}
                      mode="outlined"
                      keyboardType="decimal-pad"
                      error={touched.price && !!errors.price}
                    />
                    <HelperText type="error" visible={touched.price && !!errors.price}>
                      {errors.price}
                    </HelperText>
                  </View>

                  <Button
                    mode="outlined"
                    onPress={escolherImagem}
                    style={styles.imageButton}
                    textColor="#d32f2f"
                    icon="camera"
                  >
                    {imageUri ? 'Trocar Imagem' : 'Selecionar Imagem'}
                  </Button>

                  {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

                  <Button
                    mode="contained"
                    onPress={() => handleSubmit()}
                    style={styles.submitButton}
                    buttonColor="#d32f2f"
                    disabled={!isValid || !dirty}
                  >
                    Cadastrar Produto
                  </Button>
                </>
              )}
            </Formik>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}
