import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { NativeEventEmitter, NativeModules } from 'react-native';

import {
  advertiseStart,
  advertiseStop,
  scanStart,
} from 'react-native-ble-phone-to-phone';
import {
    BleError,
    BleManager,
    Characteristic,
    Device,
  } from "react-native-ble-plx";


interface BLEAPI{
    requestPermission(): Promise<boolean>;
    scanForPeripherals() : void;
    checking() : void;
    connectToDevice (deviceId : Device) : Promise<void>;
    advertise () : void;
    checking () : void
}

export default function bleService() : BLEAPI{
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);


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
    const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
      devices.findIndex((device) => nextDevice.id === device.id) > -1;

    const scanForPeripherals = () =>
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log(error);
        }
        console.log(device?.name);
        
        if (device && device.name?.includes("CorSense")) {
          setAllDevices((prevState: Device[]) => {
            if (!isDuplicteDevice(prevState, device)) {
              return [...prevState, device];
            }
            return prevState;
          });
        }
      });
      const checking = () => {
        const uuids = [
          '26f08670-ffdf-40eb-9067-78b9ae6e7919',
        ];
        scanStart(uuids.join()); 
        const eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);
eventEmitter.addListener('foundUuid', (data) => {
console.log('> foundUuid data : ', data)   // found uuid
});
eventEmitter.addListener('foundDevice', (data) =>
console.log('> foundDevice data : ', data) // found device
);
eventEmitter.addListener('error', (error) =>
console.log('> error : ', error)           // error message
);
eventEmitter.addListener('log', (log) =>
console.log('> log : ', log)               // log message
);
      }

      const connectToDevice = async (device: Device) => {
        try {
          const deviceConnection = await bleManager.connectToDevice(device.id);
          setConnectedDevice(deviceConnection);
          await deviceConnection.discoverAllServicesAndCharacteristics();
          bleManager.stopDeviceScan();
        } catch (e) {
          console.log("FAILED TO CONNECT", e);
        }
      };

      const advertise = async() =>{
        console.log("REACHED IN advertise in ble.ts");
        const uuid = '26f08670-ffdf-40eb-9067-78b9ae6e7919';
        console.log(uuid);
        advertiseStart(uuid);
        console.log("ADVERTISING");
        
      }
    return{
        requestPermission,
        scanForPeripherals,
        checking,
        connectToDevice,
        advertise,
    };
}