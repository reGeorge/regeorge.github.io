---
title: 基于android实现一个简单的备忘录app
date: 2017-05-20 20:13:59
tags: android
---


### 增删查改的实现

#### 创建主活动及布局文件

+ 主活动是整个app的入口，还原一下用户的使用场景：

<!--more-->

	点击新增按钮：进入AddContent活动
	点击备忘录列表上的某个Item：进入对应的备忘录的查看界面

+ 布局文件中应该有一个新建备忘录的Button和一个显示备忘录列表的ListView。

+ 在MainActivity中创建对象根据id获取到上述布局实体并添加逻辑。

	- 对Button设置点击监听事件并重写点击方法（跳转到新增备忘录的活动）:

			newbtn.setOnClickListener(new View.OnClickListener() {
			        @Override
			        public void onClick(View v) {
			           Intent i = new Intent(MainActivity.this, AddContent.class);
			           startActivity(i);
			        }
			);

	- 对ListView绑定ListViewAdapter用于绘制ListView的每一个Item中的显示内容；另外为ListView的Item设置点击监听事件并重写点击方法（跳转到查看备忘录的活动）：

			lv.setOnItemClickListener(this);
			@Override
				public void onItemClick(AdapterView<?> parent, View view, int position,
						long id) {
			    	cursor = dbReader.query(NotesDB.TABLE_NAME, null, null, null, 
			     			null, null, null);
					cursor.moveToPosition(position);
			    	Intent j = new Intent(MainActivity.this,ShowContent.class);
			    	j.putExtra(NotesDB.ID, cursor.getInt(cursor.getColumnIndex(NotesDB.ID)));
			    	j.putExtra(NotesDB.CONTENT, cursor.getString(cursor.getColumnIndex(NotesDB.CONTENT)));
			    	j.putExtra(NotesDB.TIME, cursor.getString(cursor.getColumnIndex(NotesDB.TIME)));
			    	startActivity(j);		
				}

#### 创建数据库

+ 重写了两个方法，分别是创建数据库和更新数据库。
  - 其中onUpgrade()方法确保app在覆盖安装时不会覆盖原有的数据库。

		@Override
		public void onCreate(SQLiteDatabase db) {
				db.execSQL("CREATE TABLE " + TABLE_NAME + "(" 
					    + ID +" INTEGER PRIMARY KEY AUTOINCREMENT," 
						+ CONTENT + " TEXT NOT NULL,"
						+ TIME + " TEXT NOT NULL)");//最后的括号不能忘
			}

		@Override
		public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {	
			}

#### 创建添加备忘的活动及布局文件 
+ 用户的使用场景：

	进入AddContent活动输入文字
	点击取消按钮：返回MainActivity界面
	点击保存按钮：输入的文字和当前日期时间被存入数据库

+ 布局包括一个输入文字的EditText和两个Button分别用于保存和取消。
+ 在活动中为两个按钮设置点击监听事件重写点击方法：
  - 取消按钮：finish()当前活动；需要注意的是，要想返回的活动是主界面必须在Manifest文件中为主活动添加`android:launchMode="singleTask"`的声明。
  - 保存按钮：将EditText中的文字和当前时间用ContentValue对象存入数据库；注意获取当前时间用SimpleDateFormat的format方法来得到Date对象的合适的格式，返回值类型为String。
+ ContentValue和数据库的写入方法如下：

		public void addDB() {
				ContentValues cv = new ContentValues();
				cv.put(NotesDB.CONTENT,edtext.getText().toString());
				cv.put(NotesDB.TIME, getTime());
				dbWriter.insert(NotesDB.TABLE_NAME, null, cv);
			}
		
		private String getTime() {
				SimpleDateFormat format = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");
				Date date = new Date();
				String str = format.format(date);
				return str;
			}

#### 创建查看备忘的活动及布局文件

+ 用户的使用场景：

```
进入ShowContent活动查看备忘录详细内容（包括存在数据库中的时间）
点击返回按钮：返回MainActivity界面；
点击删除按钮：删除数据库中的对应记录，并保证主活动中的列表也同步
```

+ 布局包括一个用来显示文字的EditText和两个Button分别用于返回和删除。
+  活动中两个按钮的点击监听事件：
  - 返回按钮同新增活动中的取消按钮
  - 删除按钮的`onClick`方法中的删除数据库记录的代码如下：

```
public void deleteData() {
	dbWriter.delete(NotesDB.TABLE_NAME,
                       "_id="+getIntent().getIntExtra(NotesDB.ID, 0), null);
}
```
+ 活动中的EditText是用来显示备忘内容的因此将编辑属性关闭，备忘内容从启动该活动的Intent中获取。

```
s_edtxt.setText(this.getIntent().getStringExtra(NotesDB.CONTENT));
s_edtxt. setCursorVisible ( false ) ; 
s_edtxt.setFocusable(false); 
s_edtxt.clearFocus();
```

#### 创建修改备忘的活动及布局文件

- 用户的使用场景：

```
进入UpdateContent活动修改备忘录详细内容（同时更新存在数据库中的时间）
点击返回按钮：返回MainActivity界面；
点击保存按钮：输入的文字和当前日期时间覆盖数据库中对应的记录
```

+ 布局包括EditText和两个Button
+活动中为两个按钮设置点击监听事件：
  - 返回按钮同新增活动中的取消按钮
  - 保存按钮同新增按钮中的保存按钮
+ 活动中的EditText除了要显示原有的备忘内容外，还要有可以编辑的属性：

```
u_edtxt.setText(this.getIntent().getStringExtra(NotesDB.CONTENT));
u_edtxt. setCursorVisible (true) ;
u_edtxt.setFocusable(true);
u_edtxt.setSelection(u_edtxt.getText().toString().length());
```

#### 在Manifest文件中注册活动：

```
<application
        android:allowBackup="true"
        android:icon="@mipmap/ic_note_white"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme.NoActionBar">
        <activity
            android:name=".activity.MainActivity"
            android:label="@string/app_name"
            android:launchMode="singleTask"
            android:screenOrientation="portrait"
            android:theme="@style/AppTheme.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <activity
            android:name=".activity.AddContent"
            android:label="新增日程"
            android:screenOrientation="portrait"
            android:theme="@style/AppTheme.NoActionBar"
            android:windowSoftInputMode="adjustResize"></activity>
        <activity
            android:name=".activity.ShowContent"
            android:label="查看日程"
            android:screenOrientation="portrait"
            android:theme="@style/AppTheme.NoActionBar"></activity>
        <activity
            android:name=".activity.UpdateContent"
            android:label="修改日程"
            android:screenOrientation="portrait"
            android:theme="@style/AppTheme.NoActionBar"
            android:windowSoftInputMode="adjustResize"></activity>
      
    </application>
```

+ 至此，备忘录的增删改查功能已经添加完毕。

### 云端同步功能实现

#### 同步功能概述

备忘录的云端同步可以让用户在多个设备间同步数据，并提供数据备份功能。实现云同步需要考虑以下几个方面：

1. 数据存储方案
2. 用户认证
3. 同步策略
4. 冲突处理

#### 推荐的技术方案

##### 1. 后端存储选择
- LeanCloud (推荐)
  - 提供开箱即用的数据存储
  - 内置用户系统
  - 有完整的Android SDK
  - 免费额度足够个人开发者使用
- Firebase (替代方案)
  - Google官方支持
  - 实时数据同步
  - 较完善的离线支持

##### 2. 数据表设计
```sql
Note {
  objectId: String    // 唯一标识
  content: String     // 备忘内容
  createTime: Date    // 创建时间
  updateTime: Date    // 更新时间
  userId: String      // 用户ID
  isDeleted: Boolean  // 软删除标记
  version: Number     // 版本号(用于冲突处理)
}
```

#### 实现步骤 (TodoList)

##### 1. 基础配置
- [ ] 注册LeanCloud账号并创建应用
- [ ] 添加LeanCloud SDK依赖
- [ ] 在Application中初始化SDK
- [ ] 配置AndroidManifest添加所需权限

##### 2. 用户系统
- [ ] 实现注册界面
- [ ] 实现登录界面
- [ ] 实现用户信息存储
- [ ] 添加登出功能

##### 3. 数据同步
- [ ] 修改本地数据库结构，增加同步相关字段
- [ ] 实现数据上传功能
- [ ] 实现数据下载功能
- [ ] 添加定时同步服务

##### 4. 冲突处理
- [ ] 实现版本控制
- [ ] 添加冲突检测逻辑
- [ ] 实现冲突解决策略

##### 5. 离线支持
- [ ] 实现本地缓存
- [ ] 添加离线操作队列
- [ ] 网络恢复后自动同步

#### 代码示例

##### LeanCloud初始化
```java
public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        // 初始化参数依次为 this, AppId, AppKey
        AVOSCloud.initialize(this,"your_app_id","your_app_key");
    }
}
```

##### 数据同步示例
```java
public class SyncService {
    public void syncNote(Note note) {
        AVObject avNote = new AVObject("Note");
        avNote.put("content", note.getContent());
        avNote.put("createTime", note.getCreateTime());
        avNote.put("updateTime", new Date());
        avNote.put("userId", AVUser.getCurrentUser().getObjectId());
        avNote.put("version", note.getVersion());
        
        avNote.saveInBackground().subscribe(new Observer<AVObject>() {
            @Override
            public void onSuccess(AVObject avObject) {
                // 同步成功处理
            }
            
            @Override
            public void onError(Throwable throwable) {
                // 错误处理
            }
        });
    }
}
```

#### 注意事项

1. 数据安全
- 设置适当的ACL权限
- 敏感数据加密存储
- 使用HTTPS传输

2. 性能优化
- 批量同步而不是单条同步
- 合理设置同步频率
- 压缩数据包大小

3. 用户体验
- 同步状态提示
- 网络异常处理
- 后台静默同步

4. 耗电优化
- 使用WorkManager调度同步任务
- 根据网络状态调整同步策略
- 避免频繁同步

#### 后续优化方向

1. 支持多设备同步
2. 添加同步历史记录
3. 实现数据版本回滚
4. 添加同步设置选项
5. 支持选择性同步

参考文档：
- [LeanCloud 文档中心](https://leancloud.cn/docs/)
- [Android WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager)
- [Android 数据同步最佳实践](https://developer.android.com/training/sync-adapters)