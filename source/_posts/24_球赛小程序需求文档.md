---
title: 球赛小程序需求文档
date: 2025-01-28
tags: 
  - 项目文档
---

# 球赛小程序需求与方案文档

## 一、项目概述

开发一个面向乒乓球运动爱好者的赛事组织和积分管理小程序，帮助用户便捷地参与比赛、记录成绩和追踪个人成长。

## 二、核心功能需求

### 1. 用户系统
- 微信授权登录
- 个人信息管理
  - 基础信息(昵称、头像等)
  - 技术等级/积分
  - 历史对战信息

### 2. 赛事管理
- 赛事发布
  - 比赛类型(单打/双打)
  - 时间地点
  - 参赛要求
  - 费用说明
  - 人数限制
- 赛事报名
  - 在线报名
  - 报名费支付
  - 退赛处理
- 赛程安排
  - 自动分组/对阵
  - 赛程时间表
  - 场地分配

### 3. 比分记录
- 实时比分录入
- 比赛结果确认
- 历史比赛查询
- 数据统计分析

### 4. 积分系统
- 积分规则配置
- 积分实时计算
- 积分排行榜
- 等级晋升机制

## 三、技术方案

### 1. 技术选型
- **前端**
  - Vue3 + Vant UI（移动端H5框架）
  - 一套代码，同时支持H5和小程序
- **后端**
  - SpringBoot（单体应用）
  - MySQL（单数据库）
  - 文件直接存储在服务器

### 2. 开发步骤

#### 2.1 前端快速启动
```bash
# 使用 Vue CLI 创建项目
vue create sports-h5

# 安装 Vant UI
npm i vant

# 配置移动端适配
npm i postcss-px-to-viewport -D
```

#### 2.2 页面开发示例
```vue
<!-- 赛事列表页面 -->
<template>
  <div class="tournament-list">
    <!-- 顶部导航 -->
    <van-nav-bar title="赛事列表" />
    
    <!-- 赛事列表 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item.id">
        <template #title>
          <div class="title">{{item.title}}</div>
          <div class="info">
            <span>{{item.startTime}}</span>
            <span>{{item.venue}}</span>
          </div>
        </template>
        <template #right-icon>
          <van-button size="small" @click="onJoin(item)">
            报名
          </van-button>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>
```

#### 2.3 后端精简版
```java
// 主要目录结构
sports-server
  ├── controller    // 接口控制器
  ├── service      // 业务逻辑
  ├── entity      // 数据实体
  ├── mapper      // 数据访问
  └── config      // 基础配置

// 示例代码
@RestController
@RequestMapping("/api/tournament")
public class TournamentController {
    
    @GetMapping("/list")
    public Result list() {
        return Result.success(tournamentService.list());
    }
    
    @PostMapping("/join")
    public Result join(@RequestBody JoinRequest req) {
        tournamentService.join(req);
        return Result.success();
    }
}
```

### 3. 数据库精简设计
```sql
-- 用户表
CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    points INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 赛事表
CREATE TABLE tournament (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    start_time DATETIME,
    venue VARCHAR(100),
    max_players INT,
    status TINYINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 报名表
CREATE TABLE registration (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tournament_id BIGINT,
    user_id BIGINT,
    status TINYINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 4. 开发流程建议

1. **先开发H5版本**
   - 开发和调试更方便
   - 可以在浏览器中预览
   - 更容易分享给他人测试

2. **功能逐步实现**
   - 先实现基础的赛事列表、报名功能
   - 再添加用户登录、积分系统
   - 最后考虑其他扩展功能

3. **测试方法**
   - 使用浏览器开发者工具的手机模式
   - 真机访问H5页面测试
   - postman测试后端接口

### 5. 部署说明

1. **简单部署方案**
```bash
# 前端打包
npm run build
# 将dist目录放到nginx的html目录

# 后端打包
mvn package
# 运行jar包
java -jar sports-server.jar
```

2. **nginx配置示例**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端页面
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # 后端接口
    location /api {
        proxy_pass http://localhost:8080;
    }
}
```

### 6. 后续优化方向
1. H5转小程序（可使用uni-app重构）
2. 添加文件上传功能
3. 集成微信支付
4. 添加数据统计

## 四、项目实施计划

### 第一阶段：基础框架搭建（2周）
- [x] 项目初始化
  - [x] 前端项目搭建(Vue3 + Vant)
  - [x] 后端项目搭建(SpringBoot + MyBatis)
  - [x] 数据库环境搭建(MySQL)
- [x] 用户系统开发
  - [x] 基础框架搭建
  - [x] 统一响应处理
  - [x] 全局异常处理
  - [x] 跨域配置
  - [ ] 用户登录注册
  - [ ] 用户信息管理
- [x] 数据库设计
  - [x] 用户表设计
  - [x] 用户认证表设计
  - [ ] 其他业务表设计

### 开发环境搭建说明

1. **后端环境配置**
```bash
# 数据库配置
- MySQL 8.0+
- 创建数据库: sports_db
- 执行初始化脚本: sports-server/src/main/resources/db/init.sql

# 启动后端服务
cd sports-server
mvn spring-boot:run
```

2. **前端环境配置**
```bash
# 安装依赖
cd sports-h5
npm install

# 启动开发服务器
npm run serve
```

3. **接口测试**
```bash
# 测试用户接口
curl http://localhost:8088/api/user/test
curl http://localhost:8088/api/user/list
```

### 已完成功能
1. 基础框架搭建
   - SpringBoot 基础配置
   - MyBatis 集成
   - 数据库连接池配置(HikariCP)
   - 统一响应处理
   - 全局异常处理
   - 跨域支持

2. 数据库设计
   - 用户表(user)
   - 用户认证表(user_auth)

### 下一步计划
1. 完善用户系统
   - 实现用户注册
   - 实现用户登录
   - 完善用户信息管理

2. 开发赛事管理功能
   - 设计赛事相关表
   - 实现赛事CRUD接口

### 第二阶段：核心功能开发（4周）
- [ ] 赛事管理模块
- [ ] 比分记录模块
- [ ] 积分系统实现

### 第三阶段：功能完善（2周）
- [ ] 社交互动功能
- [ ] 数据统计分析
- [ ] 支付功能集成

### 第四阶段：测试优化（2周）
- [ ] 功能测试
- [ ] 性能优化
- [ ] 上线准备

## 五、注意事项

### 1. 安全性考虑
- 用户信息保护
- 支付安全
- 数据备份

### 2. 性能优化
- 首屏加载优化
- 请求响应优化
- 数据缓存策略

### 3. 用户体验
- 界面交互设计
- 操作流程优化
- 错误提示友好化

## 六、后续规划

### 1. 功能扩展
- 引入AI对手推荐
- 添加视频直播功能
- 开发裁判系统

### 2. 运营计划
- 举办线上赛事
- 积分商城
- 广告变现

### 3. 数据应用
- 选手数据分析
- 技术提升建议
- 赛事预测模型 

