import { DeviceUtils } from "./DeviceUtils"

export const getFontDefault = () => {
    if(DeviceUtils.isAndroid()){
        return "Grandstander-Medium"
    }
    return "Grandstander-Regular"
}