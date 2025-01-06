import { PermissionsAndroid } from "react-native";


interface BLEAPI{
    requestPermission(): Promise<boolean>;
}

export default function bleService() : BLEAPI{
    const requestPermission = async () =>{
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
              title: "Location Permission",
              message: "Bluetooth Low Energy requires Location",
              buttonPositive: "OK",
            }
          );
          const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
              title: "Location Permission",
              message: "Bluetooth Low Energy requires Location",
              buttonPositive: "OK",
            }
          );
          const fineLocationPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message: "Bluetooth Low Energy requires Location",
              buttonPositive: "OK",
            }
          );
          const bleAdvertising = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
            {
              title: "Advertise Permission",
              message: "Bluetooth Low Energy requires Location",
              buttonPositive: "OK",
            }
          );
          return (
            bluetoothScanPermission === "granted" &&
            bluetoothConnectPermission === "granted" &&
            fineLocationPermission === "granted"&&
            bleAdvertising === "granted"
          );
    }
    return{
        requestPermission 
    };
}