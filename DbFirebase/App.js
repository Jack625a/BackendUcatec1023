//Importaciones de las dependencias
import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView,Button,TouchableOpacity, Modal, TextInput, Pressable} from 'react-native';
import {initializeApp} from 'firebase/app';
import {getDatabase, ref, onValue, push, set} from 'firebase/database';

const FirebaseData=()=>{
  const [productData, setProductData]=useState([]);
  const [selectProduct, setSelectProduct]=useState(null);
  const [cantidad, setCantidad]=useState(1);
  const [nameUser, setNameUser]=useState("");
  const [modalVisible,setModalVisible]=useState(false);
  const [estado,setEstado]=useState("Pendiente");
  
  const firebaseconfig={
      
    };
    //Conexion con Firebase
    const firebaseApp=initializeApp(firebaseconfig);
    const database=getDatabase(firebaseApp);
    const productsRef= ref(database, 'Productos');
    const ordersRef=ref(database, 'Pedidos');


  useEffect(()=>{
    //Recorrido de los registros
    onValue(productsRef,(snapshot)=>{
      if(snapshot.exists()){
        //Obtencion de los datos de firebase de la rama Productos
        const data=snapshot.val();
        const productArray=[];

        //recorrido a todos los datos
        for(const key in data){
          if(data.hasOwnProperty(key)){
            const product=data[key];
            productArray.push({
              key,
              nombre:product.nombre,
              precio:product.precio,
              imagen:product.imagen,
            });
          }
        }
        setProductData(productArray);
      }
    });

  },[]);

//funcion para activar la pantalla emergente en base a la seleccion del producto
const ProductSelection=(product)=>{
  setSelectProduct(product);
  setModalVisible(true);
};

const orderRequest=()=>{
  if(selectProduct && cantidad>0 && nameUser !==""){
    const orderData={
      NombreProducto: selectProduct.nombre,
      Cantidad: cantidad,
      Precio: selectProduct.precio,
      Total: cantidad*selectProduct.precio,
      Cliente: nameUser,
      Estado: "Pendiente",
      
    };
  const newOrderRef=push(ordersRef);
  set(newOrderRef,orderData);
  setModalVisible(false);
  setSelectProduct(null);
  setCantidad(1);
  setNameUser("");
  }
};




return(
  <View style={styles.container}>
      <Text style={styles.titulo}>Productos</Text>
      <View style={styles.productContainer}>
        {productData.map((product)=>(
          <TouchableOpacity 
              key={product.key} 
              style={styles.productoItems}
              onPress={()=>ProductSelection(product)}
              >
            <Image source={{uri:product.imagen}} style={styles.productoImagen} />
            <Text style={styles.productoNombre}>{product.nombre} </Text>
            <Text style={styles.productoPrecio}>{product.precio} Bs </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal
          visible={modalVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={()=>setModalVisible(false)}  
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
              <Image
              source={{uri:selectProduct?.imagen}}
              style={styles.modalProductImagen}
              />
              <Text style={styles.modalProductNombre}>
                Nombre: {selectProduct?.nombre}
              </Text>
              <Text style={styles.modarlProductPrecio}>
                Precio: {selectProduct?.precio} Bs
              </Text>
              <View style={styles.cantidadContainer}>
                <Pressable
                  style={styles.cantidadBoton}
                  onPress={()=>setCantidad(Math.max(cantidad-1,1))}
                >
                  <Text styles={styles.cantidadBotontTexto}>
                    -
                  </Text>
                </Pressable>
                <Text style={styles.cantidadTexto}>{cantidad}</Text>
                <Pressable
                  style={styles.cantidadBoton}
                  onPress={()=>setCantidad(cantidad+1)}
                >
                  <Text style={styles.cantidadBotontTexto}>+</Text>
                </Pressable>
              </View>
              <TextInput
               placeholder='Ingrese su nombre'
               value={nameUser}
               onChangeText={setNameUser}
               style={styles.NombreUsuarioInput}
              />
              <Text style={styles.TotalText}>
                Total a Pagar: {selectProduct? cantidad* selectProduct.precio: 0} Bs
              </Text>

              <Button
                title='Solicitar Pedido'
                onPress={orderRequest}
                styles={styles.boton}
                />
              <Button
                title='Cerrar'
                onPress={()=>setModalVisible(false)}
                styles={styles.boton}/>
          </View>
        </View>
      </Modal>
  </View>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent:'center',
    padding:10,
  },
  productContainer:{
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between',

  },
  productoItems:{
    width:'48%',
    marginBottom:15,
    borderWidth:1,
    borderColor:'#ccc',
    padding:10,
    borderRadius:10,
  },
  productoImagen:{
    width:'100%',
    height:120,

  },
  productoNombre:{
    fontSize:18,
    fontWeight:'bold',
    fontFamily:'Roboto',
  },
  productoPrecio:{
    fontSize:16,
  },
  titulo:{
    fontSize:20,
    fontWeight:"bold",
    paddingBottom:20,

  },
  modalContainer:{
    backgroundColor:"#fff",
    flex:1,
    justifyContent:"center",
    alignItems:'center',
  },
  modalContent:{
      backgroundColor:"#fff",
      padding:15,
      borderRadius:20,
      width:"70%",
      alignItems:"center",

  },
  modalProductImagen:{
    width:180,
    height:150,
    marginBottom:10,
    borderRadius:20,
  },
  modalProductNombre:{
    fontSize:18,
    fontWeight:"bold",
  },
  modarlProductPrecio:{
    fontSize:16,
  },
  cantidadContainer:{
    flexDirection:"row",
    alignItems:"center",
    marginBottom:10,
  },
  cantidadBoton:{
    backgroundColor:"#5EE0BB",
    borderRadius:10,
    paddingHorizontal:15,
    paddingVertical:8,
    marginHorizontal:10,
  },
  cantidadBotontTexto:{
    fontSize:18,
  },
  cantidadTexto:{
    fontSize:18,
    fontWeight:"bold",
  },
  NombreUsuarioInput:{
    borderColor:"#ccc",
    borderWidth:1,
    borderRadius:5,
    padding:10,
    marginBottom:10
  },
  TotalText:{
    fontSize:18,
    fontWeight:"bold",
    marginBottom:10,
  },
  boton:{
    width:"60%",
    paddingBottom:10,
  }
});

export default FirebaseData;
