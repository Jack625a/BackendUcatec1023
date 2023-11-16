import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity,FlatList } from 'react-native';
import React, {useEffect,useState} from 'react';
import {initializeApp} from 'firebase/app';
import {getDatabase,ref,onValue,update} from 'firebase/database';
//Dependencias de la notificacion Push
import registerNNPushToken from 'native-notify';
import axios from 'axios';

import { registerIndieID, unregisterIndieDevice } from 'native-notify';


const PedidosScreen=()=>{
  const [pedidos,setPedidos]=useState([]);
  const [firebaseInitialized, setFirebaseInitialized]=useState(false);
  const [seleccionPedidoId,setSeleccionPedidoId]=useState(null);
  let database;
  //Conexion con el servidor
  registerNNPushToken(, '');

  const firebaseConfig = {
   
  };
  
  useEffect(()=>{
    const firebaseApp=initializeApp(firebaseConfig);
    database=getDatabase(firebaseApp);
    const pedidoRef=ref(database, "Pedidos");

    onValue(pedidoRef, (snapshot)=>{
      if(snapshot.exists()){
        const pedidosData=snapshot.val();
        const pedidosArray=[];

        for(const key in pedidosData){
          if(pedidosData.hasOwnProperty(key)){
            const pedido={
              id:key,
              ...pedidosData[key],
            };
            pedidosArray.push(pedido);
          }
        }
        setPedidos(pedidosArray);
        setFirebaseInitialized(true);
      }
    });
  },[]);

const actualizacionEstado=(pedidoId, nuevoEstado, idPush)=>{
  const database=getDatabase();
  const pedidoRef=ref(database,`Pedidos/${pedidoId}`);
  const Titulo='UCATEC BACKEND';
  const Mensaje=nuevoEstado;

  
  update(pedidoRef,{
    Estado: nuevoEstado,
  });
  axios.post(`https://app.nativenotify.com/api/indie/notification`, {
      subID: idPush,
      appId: ,
      appToken: '',
      title: Titulo,
      message: Mensaje,
 });

};

return(
  <View style={styles.container}>
    <Text>Lista de Pedidos</Text>
    {firebaseInitialized?(
      <FlatList
      data={pedidos}
      keyExtractor={(item)=>item.id}
      renderItem={({item})=>(
        <View style={styles.pedidoItem}>
         <Text>Nombre del Cliente:{item.Cliente} </Text>
         <Text>Producto: {item.NombreProducto} </Text>
         <Text>Cantidad: {item.Cantidad} </Text>
         <Text>Precio Producto: {item.Precio} </Text>
         <Text>Total: {item.Total} </Text>
         <Text>Estado: {item.Estado} </Text>
         <Text>idPush:{item.idPush} </Text>
         <TouchableOpacity
          style={styles.estadoBoton}
          onPress={()=>actualizacionEstado(item.id,"Confirmado",item.idPush)}
         >
          <Text style={styles.textoBoton} >Confirmar</Text>
         </TouchableOpacity>
         <TouchableOpacity
          style={styles.estadoBoton}
          onPress={()=>actualizacionEstado(item.id,"Rechazado", item.idPush)}
         >
          <Text style={styles.textoBoton}>Rechazar</Text>
         </TouchableOpacity>
        </View>
      )}
      />
    ):(
      <Text>Cargando Pedidos...</Text>
    )}
  </View>
);
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:15,
    paddingHorizontal:15,
  },
  pedidoItem:{
    marginBottom:15,
    borderWidth:1,
    borderColor:"#2B4745",
    padding:10,
  },
  estadoBoton:{
    backgroundColor:'#2B4745',
    marginTop:10,
    padding:10,
    borderRadius:10,
    alignItems:"center",
  },
  textoBoton:{
    fontSize:14,
    color:"#fff",
  }
});

export default PedidosScreen;