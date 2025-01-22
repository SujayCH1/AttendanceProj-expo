import { PermissionsAndroid, Alert, Platform } from "react-native";
import { BleManager, Device, State } from "react-native-ble-plx";
import { insertStudentUUIDinActiveSessions } from "../api/useGetData";

interface BLEAPI {
  requestPermissions(): Promise<boolean>;
  startScanning(uuids: string | string[], student_uuid: string): Promise<boolean>;
  stopScanning(): void;
  startAdvertising(uuid: string): Promise<void>;
  stopAdvertising(): Promise<void>;
  cleanup(): void;
}

export default function bleService(): BLEAPI {
  const manager = new BleManager();
  let scanSubscription: any = null;

  const PERMISSIONS = {
    android: [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
    ],
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== "android") {
      console.warn("Permissions only implemented for Android");
      return true;
    }

    try {
      const results = await Promise.all(
        PERMISSIONS.android.map((permission) =>
          PermissionsAndroid.request(permission, {
            title: "Bluetooth Permissions",
            message: "This app requires Bluetooth permissions to function properly",
            buttonPositive: "OK",
          })
        )
      );

      return results.every((result) => result === PermissionsAndroid.RESULTS.GRANTED);
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return false;
    }
  };

  const startScanning = async (uuids: string | string[], student_uuid: string): Promise<boolean> => {
    try {
      console.log("Starting scan for UUIDs:", uuids);
      
      const state = await manager.state();
      if (state !== State.PoweredOn) {
        Alert.alert("Bluetooth is not enabled");
        return false;
      }

      scanSubscription = manager.onStateChange((state) => {
        if (state === State.PoweredOn) {
          manager.startDeviceScan(
            Array.isArray(uuids) ? uuids : [uuids],
            { allowDuplicates: false },
            (error, device) => {
              if (error) {
                console.error("Scan error:", error);
                Alert.alert("Error", "Failed to scan for devices");
                return;
              }

              if (device && device.serviceUUIDs) {
                console.log("Found device:", device.id, device.serviceUUIDs);
                try {
                  const foundUUID = device.serviceUUIDs[0];
                  insertStudentUUIDinActiveSessions(foundUUID, student_uuid);
                  Alert.alert("Attendance Marked Successfully");
                  stopScanning();
                } catch (error) {
                  console.error("Error processing device:", error);
                  Alert.alert("Error", "Failed to mark attendance");
                }
              }
            }
          );
        }
      }, true);

      return true;
    } catch (error) {
      console.error("Error starting scan:", error);
      return false;
    }
  };

  const stopScanning = (): void => {
    console.log("Stopping scan");
    manager.stopDeviceScan();
    if (scanSubscription) {
      scanSubscription.remove();
      scanSubscription = null;
      manager.destroy()
    }
  };

  const startAdvertising = async (uuid: string): Promise<void> => {
    try {
      // Note: react-native-ble-plx doesn't support advertising
      // You'll need a separate library like react-native-ble-advertiser for this
      throw new Error("Advertising not supported with react-native-ble-plx");
    } catch (error) {
      console.error("Error starting advertisement:", error);
      throw error;
    }
  };

  const stopAdvertising = async (): Promise<void> => {
    // Not implemented as advertising isn't supported
    console.log("Advertising stop called (not implemented)");
  };

  const cleanup = (): void => {
    console.log("Cleaning up BLE resources");
    stopScanning();
    manager.destroy();
  };

  return {
    requestPermissions,
    startScanning,
    stopScanning,
    startAdvertising,
    stopAdvertising,
    cleanup,
  };
}