import PushNotification from "react-native-push-notification";

PushNotification.configure({
    onNotification: function(notification) {
    
        // process the notification
    
        // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
        //notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    requestPermissions: true,
})

export default PushNotification;