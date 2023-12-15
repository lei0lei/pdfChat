// const { createProxyMiddleware } = require('http-proxy-middleware');

// const proxy = createProxyMiddleware({
//     target: 'https://pdfchat-server.azurewebsites.net.com', // 你的 Nest.js 服务地址
//     changeOrigin: true
// });

// // export default function(req, res) {
// //     proxy(req, res, (result) => {
// //         if (result instanceof Error) {
// //             throw result;
// //         }
        
// //         throw new Error(`Request '${req.url}' is not proxied! We should never reach here!`);
// //     });
// // }


// export default async function handler(req, res) {
//     if (req.method === 'POST') {
//         console.log('AAA')
//         try {
//             const response = await fetch('https://pdfchat-server.azurewebsites.net.com/test_backend', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(req.body),
//             });

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const data = await response.json();
//             res.status(200).json(data);
//         } catch (error) {
//             res.status(500).json({error: 'Error connecting to the third party api'});
//         }
//     } else {
//         res.setHeader('Allow', ['POST'])
//         res.status(405).end(`Method ${req.method} Not Allowed`)
//     }
// }


// export const config = {
//     api: {
//         bodyParser: false,  // 这里需要关闭 Next.js 的内置 body 解析器，让代理库接管请求。
//         externalResolver: true,
//     }
// }

// export async function GET(Request) {
//     return new Response("This is a new API route");
//   }