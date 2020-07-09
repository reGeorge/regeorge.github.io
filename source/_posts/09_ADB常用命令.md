---
title: ADB常用命令
date: 2018-07-01 20:32:18
tags: ADB
---

#### 获取应用包名（打开应用）

	adb shell "dumpsys window | grep mCurrentFocus"

#### 获取应用安装路径

	adb shell pm path 包名

#### 获取应用版本号

	adb shell "pm dump 包名 | grep "versionName""

<!--more-->

#### 获取手机系统信息（ CPU，厂商名称等）

	adb shell "cat /system/build.prop | grep "product""

#### 获取手机系统版本

	adb shell getprop ro.build.version.release

#### 获取手机系统api版本

	adb shell getprop ro.build.version.sdk

#### 获取手机设备型号

	adb -d shell getprop ro.product.model

#### 获取手机厂商名称

	adb -d shell getprop ro.product.brand

#### 获取手机的序列号

	有两种方式
	adb get-serialno
	adb shell getprop ro.serialno

#### 获取手机的IMEI

	有三种方式，由于手机和系统的限制，不一定获取到
	adb shell dumpsys iphonesubinfo
	其中Device ID即为IMEI号

	adb shell getprop gsm.baseband.imei
	service call iphonesubinfo 
	此种方式，需要自己处理获取的信息得到

#### 获取手机mac地址

	adb shell cat /sys/class/net/wlan/address
	adb shell cat /sys/class/net/wlan0/address

#### 获取手机内存信息

	adb shell cat /proc/meminfo

#### 获取手机存储信息

	adb shell df

#### 获取手机内部存储信息：

	魅族手机： adb shell df /mnt/shell/emulated
	其他： adb shell df /data

#### 获取sdcard存储信息：

	adb shell df /storage/sdcard

#### 获取手机分辨率

	adb shell "dumpsys window | grep mUnrestrictedScreen"

#### 获取手机物理密度

	adb shell wm density

#### 获取当前界面对应的活动和包名

	adb shell "dumpsys window | grep mCurrentFocus"
