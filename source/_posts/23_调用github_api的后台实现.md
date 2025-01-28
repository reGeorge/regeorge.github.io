---
title: 调用github_api的后台实现
date: 2025-01-12
---


## Python版本实现方案

### 1. 项目结构
```bash
project-name/
├── api/
│   └── webhook.py      # 处理微信消息的主函数
├── libs/
│   ├── github_api.py   # GitHub API 操作
│   ├── wechat.py       # 微信消息处理
│   └── utils.py        # 工具函数
├── tests/              # 测试文件
├── requirements.txt    # 依赖管理
└── vercel.json         # Vercel配置
```

### 2. 核心代码示例

1. **webhook处理函数**
```python
# api/webhook.py
from http.client import HTTPException
from libs.wechat import WeChatMessage
from libs.github_api import GitHubAPI
from libs.utils import validate_signature

async def handler(request):
    # 处理GET请求（微信服务器验证）
    if request.method == 'GET':
        query = request.query
        if validate_signature(query):
            return Response(query.get('echostr', ''))
        return Response('Invalid signature', status_code=403)
    
    # 处理POST请求（接收消息）
    if request.method == 'POST':
        try:
            message = WeChatMessage(await request.body())
            if message.msg_type == 'text':
                github = GitHubAPI()
                await github.create_post(message.format_post())
                return Response('success')
        except Exception as e:
            print(f"Error processing message: {str(e)}")
            return Response('success')  # 总是返回success避免微信服务器重试
            
    return Response('Method not allowed', status_code=405)
```

2. **微信消息处理**
```python
# libs/wechat.py
import xml.etree.ElementTree as ET
from datetime import datetime

class WeChatMessage:
    def __init__(self, xml_data):
        root = ET.fromstring(xml_data)
        self.msg_type = root.find('MsgType').text
        self.content = root.find('Content').text
        self.from_user = root.find('FromUserName').text
        self.create_time = int(root.find('CreateTime').text)

    def format_post(self):
        # 将消息转换为博客文章格式
        lines = self.content.split('\n', 1)
        title = lines[0]
        content = lines[1] if len(lines) > 1 else ''
        
        return {
            'title': title,
            'date': datetime.now().strftime('%Y-%m-%d'),
            'content': content
        }
```

3. **GitHub API操作**
```python
# libs/github_api.py
import os
import base64
from datetime import datetime
import httpx

class GitHubAPI:
    def __init__(self):
        self.token = os.environ.get('GITHUB_TOKEN')
        self.repo = os.environ.get('GITHUB_REPO')
        self.headers = {
            'Authorization': f'token {self.token}',
            'Accept': 'application/vnd.github.v3+json'
        }

    async def create_post(self, post_data):
        # 生成文件名
        filename = f"source/_posts/{datetime.now().strftime('%Y%m%d')}_{post_data['title']}.md"
        
        # 生成文章内容
        content = f"""---
title: {post_data['title']}
date: {post_data['date']}
categories:
  - 博客
tags:
  - 随笔
---

{post_data['content']}
"""
        
        # 创建或更新文件
        url = f'https://api.github.com/repos/{self.repo}/contents/{filename}'
        data = {
            'message': f'Add post: {post_data["title"]}',
            'content': base64.b64encode(content.encode()).decode()
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.put(url, json=data, headers=self.headers)
            response.raise_for_status()
```

### 3. 依赖配置

```txt
# requirements.txt
httpx==0.24.1
python-dotenv==1.0.0
pytest==7.4.0
pytest-asyncio==0.21.1
```

### 4. Vercel配置
```json
{
  "version": 2,
  "functions": {
    "api/webhook.py": {
      "runtime": "python3.9"
    }
  }
}
```

### 5. 本地开发环境设置

1. **创建虚拟环境**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

2. **安装Vercel CLI**
```bash
npm i -g vercel
```

3. **本地测试**
```bash
vercel dev
```

### 6. 环境变量

1. **本地开发**
```env
GITHUB_TOKEN=your_github_token
GITHUB_REPO=username/repo
WECHAT_TOKEN=your_wechat_token
```

2. **Vercel部署**
- 在Vercel项目设置中配置相同的环境变量