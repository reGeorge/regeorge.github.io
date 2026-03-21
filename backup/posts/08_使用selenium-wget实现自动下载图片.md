---
title: 使用selenium+wget实现自动下载图片
date: 2018-03-05 23:04:42
tags: python
---

#### 操作步骤

unsplash.com是一个免费下载高清图片的网站，我们可以使用web自动化工具selenium来批量获取该网站主页上提供的海量图片下载链接，并使用强大的多线程下载工具wget下载这些图片。

另外，selenium需要配合chromedriver.exe来操控谷歌浏览器，我们可以通过搜索下载对应浏览器版本的chromedriver.exe

<!--more-->

#### 环境安装

1. selenium
2. wget

	pip install selenium
	pip install wget

#### python脚本

	from selenium import webdriver
	import wget
	import os
	import time
	import subprocess

	def mkdir(path):
	    # 去除首位空格
	    path=path.strip()
	    # 去除尾部 \ 符号
	    path=path.rstrip("\\")

	    # 判断路径是否存在
	    # 存在     True
	    # 不存在   False
	    isExists=os.path.exists(path)

	    # 判断结果
	    if not isExists:
	        # 如果不存在则创建目录
	        print ('%s创建成功'%path)
	        # 创建目录操作函数
	        os.makedirs(path)
	        return True
	    else:
	        # 如果目录存在则不创建，并提示目录已存在
	        print ('%s目录已存在'%path)
	        return False


	def download_pic(folderpath='',list=[]):
	    i = 1
	    for url in list:
	        try:
	        #     wget.download(url, out='%s\\%d.jpg' %(folderpath,i))
	            cmd = 'C:\\Python36\\Scripts\\wget -O "%s\\%d.jpg" "%s"' %(folderpath,i,url)
	            print(cmd)
	            subprocess.Popen(cmd)
	            i += 1
	        except:
	            print('skip')
	    print('下载成功...')

	def craw_url(scroll='2',web_url=''):
	    driver = webdriver.Chrome('C:\\Python36\\Lib\site-packages\\chromedriver_binary\\chromedriver.exe')
	    driver.get(web_url)
	    driver.maximize_window()
	    time.sleep(3)
	    urls = []
	    try:
	        for i in range(1,scroll):
	            pics = driver.find_elements_by_class_name(name='_2zEKz')
	            for pic in pics:
	                src = '%s\n'%pic.get_attribute(name='src')
	                src = src.replace('1000','2592')
	                # print(src)
	                urls.append(src)
	            js="window.scrollTo(0,document.body.scrollHeight)"
	            driver.execute_script(js)
	            time.sleep(3)
	            print("循环次数：%d"%i)
	        driver.close()
	    except:
	        driver.close()
	    urls = list(set(urls))
	    print('获取图片链接成功...')
	    return urls

	if __name__ == "__main__":
	    download_path = 'G:\\02_photo\\unsplash'
	    url_list=craw_url(scroll=1000,web_url='https://unsplash.com/')
	    mkdir(download_path)
	    download_pic(folderpath=download_path,list=url_list)

	    #	for url in url_list:
	    #	        print(url)
	    #	try:
	    #    	f=open('%s\\0_urls.txt'%download_path,'w')
	    #   	f.writelines(url_list)
	    #   	f.close()
	    #	except:
	       	 	pass
	    	
#### 下载成功

![1.png](http://upload-images.jianshu.io/upload_images/1894726-f5a17a997569edfb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

