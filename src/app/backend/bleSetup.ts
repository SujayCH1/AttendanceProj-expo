import { PermissionsAndroid, Alert } from "react-native";
import { NativeEventEmitter, NativeModules } from "react-native";
import { advertiseStart, advertiseStop, scanStart, scanStop } from "react-native-ble-phone-to-phone";

interface BLEAPI {
  requestPermission(): Promise<boolean>;
  checking(uuid: string): void;
  advertise(uuid1: string): void;
  stopScanning(): Promise<void>;
  advertiseStop(): Promise<void>;
}

export default function bleService(): BLEAPI {
  const requestPermission = async () => {
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
      fineLocationPermission === "granted" &&
      bleAdvertising === "granted"
    );
  };

  const checking = (uuid: string) => {
    const uuidsArray = uuid.split(",");
    scanStart(uuidsArray.join());
    const eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);

    eventEmitter.addListener("foundUuid", (data) => {
      console.log("> foundUuid data : ", data);
      Alert.alert(
        "Attendance Marked",
        "Attendance marked successfully!",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    });

    eventEmitter.addListener("foundDevice", (data) =>
      console.log("> foundDevice data : ", data)
    );
    eventEmitter.addListener("error", (error) =>
      console.log("> error : ", error)
    );
    eventEmitter.addListener("log", (log) =>
      console.log("> log : ", log)
    );
  };

  const stopScanning = () => {
    return scanStop();
  };

  const advertise = async (uuid1: string) => {
    console.log("REACHED IN advertise in ble.ts");
    const uuid = uuid1;
    console.log(uuid);
    advertiseStart(uuid);
    console.log("ADVERTISING");
  };

  const advertiseStop = async () => {
    console.log("ADVERTISING STOPP");
    advertiseStop();
  };

  return {
    requestPermission,
    checking,
    advertise,
    stopScanning,
    advertiseStop,
  };
}
