import { useRouter } from "next/router"
import { useState,useContext } from "react"
import '../../styles/globals.css'
import Link from 'next/link';
import { PdfContext } from '../../app/dashboard/context.js'; 
export default function Login() {
    const router = useRouter()
    const { updateTokens} = useContext(PdfContext);
    const [state, setState] = useState({
      username: "",
      password: ""
    })

    function handleChange(e) {
      const copy = { ...state }
      copy[e.target.name] = e.target.value
      setState(copy)
    }

    async function handleSubmit(e) {
      // console.log(state)
      e.preventDefault();
      const res = await fetch('https://pdfchat-server.azurewebsites.net/api/auth/signin',{//`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, {
        method: "POST",
        body: JSON.stringify(state),
        headers: {
          "Content-Type": "application/json",
        }
        
      })
      if (res.ok) {
        const json = await res.json()
        localStorage.setItem("username", state.username)
        localStorage.setItem("token", json.token)
        console.log(json)
        // updateTokens(json.token)
        router.push("/test")
      } else {
        alert("用户名或密码错误")
      }
    }
    return (
      <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
        <div className="h-screen flex justify-center items-center bg-gray-900">
    <div className="flex h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
              登录您的账户
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                  用户名
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="username"
                    value={state.username} 
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                    密码
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      忘记密码?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={state.password} 
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  登录
                </button>
              </div>
            </form>
            <Link href="/auth/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">新用户, 点击这里注册  👉
            </Link>
  
          </div>
        </div>
        </div>
      </>
    )
  }