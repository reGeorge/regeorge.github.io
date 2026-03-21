---
title: ADB常用命令
date: 2018-07-01 20:32:18
tags: ADB
---

|    adb    | 命令                                       | 含义                                 |
| :-------: | ------------------------------------------ | ------------------------------------ |
| adb shell | adb shell "dumpsys window \| grep mCurrentFocus"                  | 获取应用包名（打开应用）             |
|           | adb shell pm path 包名                     | 获取应用安装路径                     |
|           | adb shell "pm dump 包名                    | 获取应用版本号                       |
|           | adb shell "cat /system/build.prop          | 获取手机系统信息（ CPU，厂商名称等） |
|           | adb shell getprop ro.build.version.release | 获取手机系统版本                     |
|           | adb shell getprop ro.build.version.sdk     | 获取手机系统api版本                  |
|           | adb -d shell getprop ro.product.model      | 获取手机设备型号                     |
|           | adb -d shell getprop ro.product.brand      | 获取手机厂商名称                     |
|           | adb shell getprop ro.serialno              | 获取手机的序列号                     |
|           | adb shell dumpsys iphonesubinfo            | 获取手机的IMEI                       |
|           | adb shell cat /sys/class/net/wlan/address  | 获取手机mac地址                      |
|           | adb shell cat /proc/meminfo                | 获取手机内存信息                     |
|           | adb shell df                               | 获取手机存储信息                     |
|           | adb shell df /mnt/shell/emulated           | 获取手机内部存储信息：               |
|           | adb shell df /storage/sdcard               | 获取sdcard存储信息：                 |
|           | adb shell "dumpsys window                  | 获取手机分辨率                       |
|           | adb shell wm density                       | 获取手机物理密度                     |
|           | adb shell "dumpsys window                  | 获取当前界面对应的活动和包名         |

  

待刷新