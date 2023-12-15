// pages/api/proxy.js
import axios from 'axios';

export default async function handler(req, res) {
  const { method, body, query } = req;

  // 这个URL应当从环境变量或其他配置中获取
  console.log('xxxxxxxxxxxxxxxxx')
  console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL; 

  
  try {
    // 使用相同的HTTP方法、请求正文和查询参数转发请求
    const { data } = await axios({ 
      method,
      url: `${backendUrl}/${query.path}`, 
      data: body,
    });

    res.status(200).json(data);
  } catch (error) {
    // res.status(error.response.status || 500).json(error.response.data);
  }
}